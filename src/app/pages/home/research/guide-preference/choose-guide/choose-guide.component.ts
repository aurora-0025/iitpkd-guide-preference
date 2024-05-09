import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NgbDropdownModule, NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { GuideChooseService } from '../../../../../services/guide-choose.service';
import { DeptNamesData, GuideData } from '../../../../../models/GuideData';

@Component({
  selector: 'app-choose-guide',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink, NgbHighlight, AsyncPipe, DecimalPipe, NgbDropdownModule],
  templateUrl: './choose-guide.component.html',
  providers: [DecimalPipe],
})

export class ChooseGuideComponent {
  steps: number = 1;
  dept: number[] = [];
  isExternal: boolean[] = [false, false, false];
  formSubmitted: boolean[] = [false, false, false];
  formGroupNames = ['guideForm1', 'guideForm2', 'guideForm3'];
  selectedGuides: number[] = [];
  guides!:GuideData[];
  dept_names!:DeptNamesData[];
  deptFilteredGuides: typeof this.guides = [];
  filteredGuides: typeof this.guides = [];
  filter = new FormControl('', { nonNullable: true });

  search(text: string, external: boolean): any[] {
    return (external ? this.guides : this.deptFilteredGuides).filter((g) => {
      const term = text.toLowerCase();
      return g.name.toLowerCase().includes(term);
    });
  }

  onGuideSelect(id: number, formIndex: number) {    
    (this.getGuideForm(formIndex + 1).get('guide') as AbstractControl<string>).patchValue(id.toString());
  }
  
  constructor (private guideChooseService: GuideChooseService) {
    this.filter.valueChanges.subscribe((text) => {
      this.filteredGuides = this.search(text, true);
      this.filteredGuides = this.search(text, false);
    });
  }

  async ngOnInit() {
    await Promise.all([await this.guideChooseService.fetchGuidesData(), await this.guideChooseService.fetchDeptNames()]);
    this.guides = this.guideChooseService.guides;
    this.dept_names = this.guideChooseService.dept_names;

    for (let i = 1; i < 4; i++) {
      this.getGuideForm(i)
        .get('external')
        ?.valueChanges.subscribe((isExtern: boolean) => {
          this.getGuideForm(i).get('guide')?.reset();
          this.getGuideForm(i).get('affiliation')?.reset();
          this.filter.reset();
          if (isExtern == true) {
            this.filteredGuides = this.guides;
            this.isExternal[i - 1] = true;
          } else if (isExtern == false) {
            this.filteredGuides = [];
            this.getGuideForm(i).get('dept')?.reset();
            this.isExternal[i - 1] = false;
          }
        });
    }
  }
  researchForm = new FormGroup({
    guideForm1: new FormGroup({
      external: new FormControl(false),
      dept: new FormControl('', Validators.required),
      guide: new FormControl('', Validators.required),
      affiliation: new FormControl({ value: '', disabled: true }),
    }),
    guideForm2: new FormGroup({
      external: new FormControl(false),
      dept: new FormControl('', Validators.required),
      guide: new FormControl('', Validators.required),
      affiliation: new FormControl({ value: '', disabled: true }),
    }),
    guideForm3: new FormGroup({
      external: new FormControl(false),
      dept: new FormControl('', Validators.required),
      guide: new FormControl('', Validators.required),
      affiliation: new FormControl({ value: '', disabled: true }),
    }),
  });

  submit() {    
    const data = Object.values(this.researchForm.value).map((e) => {
      return this.guides.find((g) => g.id == Number.parseInt(e.guide ?? "-1"));
    })
    console.log(data);
    this.guideChooseService.submitGuideChoice(data);
  }

  save() {    
    const data = Object.values(this.researchForm.value).map((e) => {
      return this.guides.find((g) => g.id == Number.parseInt(e.guide ?? "-1"));
    })
    console.log(data);
    this.guideChooseService.saveGuideChoice(data);
  }

  private getGuideForm(index: number) {
    return this.researchForm.get(`guideForm${index}`)!;
  }

  getGuideData(index: number) {
    index++;
    const guideId = this.researchForm.get(`guideForm${index}`)!.get("guide")?.value;
    return this.guides.find((g)=> g.id == Number.parseInt(guideId!));
  }

  onChangeDept(e: any, i: number) {
    this.dept[i] = e.target.value;
    this.deptFilteredGuides = this.guides.filter(g => g.dept_id == e.target.value);
    this.filteredGuides = this.deptFilteredGuides;    
    this.getGuideForm(i + 1)
      .get('guide')
      ?.reset();
    this.getGuideForm(i + 1)
      .get('affiliation')
      ?.reset();
  }

  externalGuideSelected(guide_id: number, form_index: number) {
    (this.getGuideForm(form_index + 1).get('guide') as AbstractControl<string>).patchValue(guide_id.toString());
    let currentForm = this.getGuideForm(form_index + 1);
    let affiliationForm = currentForm.get(
      'affiliation'
    ) as unknown as FormControl<string>;
    let dept_id = this.guides.find(g => g.id == guide_id)?.dept_id;
    console.log(dept_id);
    if (dept_id) affiliationForm.setValue(`${this.dept_names[dept_id].name}`);
  }

  next(current: number) {
    let currentForm = this.getGuideForm(current);
    this.formSubmitted[current - 1] = true;
    if (currentForm.valid) {
      this.selectedGuides[current - 1] = Number.parseInt(
        currentForm.get('guide')?.value!
      );
      if (current + 1 < 4) {
        let nextForm = this.getGuideForm(current + 1);
        if (nextForm.get('external')?.value) {
          this.filteredGuides = this.guides;
        } else {
          let dept_id = nextForm.get('dept')?.value
          this.deptFilteredGuides = this.guides.filter(g => g.dept_id == dept_id);
          this.filteredGuides = this.deptFilteredGuides;
        }
      }
      this.filter.reset();
      this.steps += 1;
    }
  }
  previous(current: number) {
    if (current != 4) {
      let currentForm = this.getGuideForm(current);
      this.formSubmitted[current - 2] = false;
      this.selectedGuides[current - 1] = Number.parseInt(
        currentForm.get('guide')?.value!
      );
      let nextForm = this.getGuideForm(current - 1);
      if (nextForm.get('external')?.value) {
        this.filteredGuides = this.guides;
      } else {
        let dept_id = nextForm.get('dept')?.value
        this.deptFilteredGuides = this.guides.filter(g => g.dept_id == dept_id);
        this.filteredGuides = this.deptFilteredGuides;
      }
    }
    this.filter.reset();
    this.steps -= 1;
  }
}