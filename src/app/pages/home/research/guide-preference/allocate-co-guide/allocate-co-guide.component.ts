import { Component, TemplateRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NgbAlert,
  NgbDropdownModule,
  NgbHighlight,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { CoGuideAllocationType } from '../../../../../models/CoGuideAllocationData';
import { CoGuideAllocationService } from '../../../../../services/co-guide-allocation.service';
import { GuideChooseService } from '../../../../../services/guide-choose.service';
import { GuideDataType } from '../../../../../models/GuideAllocationData';
import { GuideData } from '../../../../../models/GuideData';

@Component({
  selector: 'app-allocate-co-guide',
  standalone: true,
  imports: [
    RouterModule,
    NgbAlert,
    ReactiveFormsModule,
    NgbHighlight,
    NgbDropdownModule,
    DecimalPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DecimalPipe],
  templateUrl: './allocate-co-guide.component.html',
})
export class AllocateCoGuideComponent {
  studentIDFilter = new FormControl('', { nonNullable: true });
  studentNameFilter = new FormControl('', { nonNullable: true });
  studentsData: CoGuideAllocationType[] = [];
  selectedStudent: CoGuideAllocationType | undefined = undefined;
  filteredStudents = this.studentsData;
  guides: GuideData[] = [];
  filter = new FormControl('', { nonNullable: true });
  filteredGuides: typeof this.guides = this.guides;
  formSubmitted = false;
  isExternal = false;
  externalCoGuideForm!: FormGroup;
  coGuideForm!: FormGroup;
  selectedGuide?: (typeof this.guides)[0];

  getStudentById(id: string) {
    return this.studentsData.find((s) => s.id == id);
  }

  async ngOnInit() {
    await this.coGuideAllocationService.fetchCoGuideAllocationData();
    await this.chooseGuideService.fetchGuidesData();
    this.guides = this.chooseGuideService.guides;
    this.filteredGuides = this.guides;
    this.studentsData = this.coGuideAllocationService.coGuideAllocationData.filter(s => s.coGuide == undefined);
    this.filteredStudents = this.studentsData;
  }

  getGuideById(id: string) {    
    if (id != undefined) return this.guides.find((g) => g.id == Number.parseInt(id));
    else return undefined;
  }

  search() {
    this.filteredStudents = this.studentsData.filter((g) => {
      const Idterm = this.studentIDFilter.value.toLowerCase();
      const Nameterm = this.studentNameFilter.value.toLowerCase();

      if (Nameterm.length > 0 && Idterm.length > 0) {
        return (
          g.id.toLowerCase().includes(Idterm) ||
          g.name.toLowerCase().includes(Nameterm)
        );
      } else if (Nameterm.length > 0) {
        return g.name.toLowerCase().includes(Nameterm);
      } else {
        return g.id.toLowerCase().includes(Idterm);
      }
    });
  }

  onExternalChange(newValue: string) {
    this.filteredGuides = newValue
      ? this.guides
      : this.guides.filter(
          (g) =>
            g.dept == this.selectedStudent?.dept ||
            g.dept == this.selectedStudent?.allocatedGuide?.dept
        );
    console.log(this.filteredGuides);
  }

  guideSelect(guideId: number) {
    if (this.isExternal) {
      this.externalCoGuideForm.get('possibleCoGuide')?.setValue(guideId);
      console.log(this.guides.find(g => g.id == this.externalCoGuideForm.get('possibleCoGuide')?.value)?.name)
      console.log(this.externalCoGuideForm.get('possibleCoGuide')?.value);
    } else {
      this.coGuideForm.get('possibleCoGuide')?.setValue(guideId);
      console.log(this.guides.find(g => g.id == this.coGuideForm.get('possibleCoGuide')?.value)?.name)
      console.log(this.coGuideForm.get('possibleCoGuide')?.value);
    }
  }

  open(content: TemplateRef<any>, studentId: string) {
    this.selectedStudent = this.getStudentById(studentId);
    this.filteredGuides = this.guides.filter(
      (g) =>
        g.dept == this.selectedStudent?.dept ||
        g.dept == this.selectedStudent?.allocatedGuide?.dept
    );
    this.modalService.open(content, { size: 'xl' }).result.then(
      (result) => {
        this.formSubmitted = false;
      },
      (reason) => {
        this.externalCoGuideForm.reset();
        this.coGuideForm.reset();
        this.formSubmitted = false;
      }
    );
  }

  onSubmit() {
    if (this.isExternal) {
      if (this.externalCoGuideForm.valid) {
        let coGuideData = this.externalCoGuideForm.getRawValue();
        if (coGuideData.possibleCoGuide) {
          coGuideData.possibleCoGuide = this.guides.find((g)=> g.id == coGuideData.possibleCoGuide);
        }
        this.coGuideAllocationService.allocateCoGuide({studentID: this.selectedStudent?.id,...coGuideData})
        if(this.selectedStudent) {
         this.selectedStudent.coGuide = coGuideData;
        } 
        this.studentsData = this.coGuideAllocationService.coGuideAllocationData.filter(s => s.coGuide == undefined);
        console.log(this.studentsData);
        
        this.search();
        this.modalService.dismissAll();
      }
    } else {
      if (this.coGuideForm.valid) {
        let coGuideData = this.coGuideForm.getRawValue();
        coGuideData.possibleCoGuide = this.guides.find((g)=> g.id == coGuideData.possibleCoGuide)
        if(this.selectedStudent) {
          this.selectedStudent.coGuide = coGuideData;
        } 
        this.studentsData = this.coGuideAllocationService.coGuideAllocationData.filter(s => s.coGuide == undefined);
        console.log(this.studentsData);
        
        this.search();
        this.modalService.dismissAll();
        this.coGuideAllocationService.allocateCoGuide({studentID: this.selectedStudent?.id,...coGuideData})
      }
    }
    this.formSubmitted = true;
  }

  constructor(private modalService: NgbModal, private coGuideAllocationService: CoGuideAllocationService, private chooseGuideService: GuideChooseService) {
    this.externalCoGuideForm = new FormGroup({
      name: new FormControl('', Validators.required),
      organization_name: new FormControl('', Validators.required),
      job_title: new FormControl('', Validators.required),
      years_of_experience: new FormControl('', Validators.required),
      specialization: new FormControl('', Validators.required),
      isPhd: new FormControl(false, Validators.required),
      possibleCoGuide: new FormControl('', [
        (control) =>
          this.externalCoGuideForm?.get('isPhd')?.value === 'true'
            ? { required: true }
            : null,
      ]),
    });
    this.coGuideForm = new FormGroup({
      possibleCoGuide: new FormControl('', Validators.required),
    });

    this.externalCoGuideForm.get('isPhd')?.valueChanges.subscribe(val => {
      this.externalCoGuideForm.get('possibleCoGuide')?.reset();
    })
  }
}
