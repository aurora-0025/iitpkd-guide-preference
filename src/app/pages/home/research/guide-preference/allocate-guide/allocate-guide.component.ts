import { Component, TemplateRef, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbHighlight, NgbModal, NgbActiveModal, NgbAlertModule  } from '@ng-bootstrap/ng-bootstrap';
import { GuideAllocationService } from '../../../../../services/guide-allocation.service';
import { GuideDataType, StudentDataType } from '../../../../../models/GuideAllocationData';

@Component({
  selector: 'app-allocate-guide',
  standalone: true,
  imports: [RouterModule, NgbHighlight, FormsModule, ReactiveFormsModule, NgbAlertModule],
  templateUrl: './allocate-guide.component.html',
})
export class AllocateGuideComponent {
  studentIDFilter = new FormControl('', { nonNullable: true });
  studentNameFilter = new FormControl('', { nonNullable: true });
  studentsData: StudentDataType[] = [];
  filteredStudents = this.studentsData;
  selectedStudent: StudentDataType | undefined = undefined;
  selectedGuide!: GuideDataType;
  selectGuideForm = new FormGroup({
    guide: new FormControl('', Validators.required),
  });
  formSubmitted = false;

  async ngOnInit() {
    await this.guideAllocationService.fetchGuideAllocationData();
    this.studentsData = this.guideAllocationService.guideAllocationData.filter(s => s.allocatedGuide == undefined);
    this.filteredStudents = this.studentsData;    
  }

  getStudentById(id: string) {
    return this.studentsData.find((s)=> s.id == id);
  }

  search() {
      this.filteredStudents = this.studentsData.filter((g) => {
        const Idterm = this.studentIDFilter.value.toLowerCase();
        const Nameterm = this.studentNameFilter.value.toLowerCase();

        if (Nameterm.length > 0 && Idterm.length > 0) {
          return g.id.toLowerCase().includes(Idterm) || g.name.toLowerCase().includes(Nameterm);
        } else if (Nameterm.length > 0) {
          return g.name.toLowerCase().includes(Nameterm);
        } else {
          return g.id.toLowerCase().includes(Idterm);
        }
    });
  }

  open(content: TemplateRef<any>, studentId: string) {
    this.selectedStudent = this.getStudentById(studentId);
		this.modalService.open(content, { size: 'xl' }).result.then(
			(result) => {        
        this.selectGuideForm.get('guide')?.reset();
        this.formSubmitted = false;
			},
      (reason) => {
        this.selectGuideForm.get('guide')?.reset();        
        this.formSubmitted = false;
			});
	}

  allocateGuide() {
    this.formSubmitted = true;
    if (this.selectedStudent && this.selectGuideForm.valid) {
      let guideIndex = this.selectGuideForm.get('guide')?.value;
      if (guideIndex != null) {
        let allocatedGuide = this.selectedStudent.pendingGuideAllocation[Number.parseInt(guideIndex)];
        this.selectedStudent.allocatedGuide = allocatedGuide;
        this.selectedStudent.pendingGuideAllocation = [];
        this.studentsData = this.guideAllocationService.guideAllocationData.filter(s => s.allocatedGuide == undefined);
        this.search();
        this.modalService.dismissAll();
        this.guideAllocationService.allocateGuide({ studentId: this.selectedStudent.id,allocation:allocatedGuide});
      }
    }
  }

  constructor (private modalService: NgbModal, private guideAllocationService : GuideAllocationService) {
  }
}


