import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DeptNamesData, GuideData } from '../models/GuideData';
import { PostDataService } from './post-data.service';

@Injectable({
  providedIn: 'root',
})
export class GuideChooseService {
constructor(private postDataService: PostDataService) { }
  guides: GuideData[] = [];
  dept_names: DeptNamesData[] = [];

  async fetchGuidesData() {
    try {
      this.guides = (await (
        await fetch(environment.GUIDE_DATA_API)
      ).json()) as GuideData[];
    } catch (error) {
      this.guides = [];
      console.error(error);
    }
  }

  async fetchDeptNames() {
    this.dept_names;
    try {
      this.dept_names = (await (
        await fetch(environment.DEPT_NAMES_API)
      ).json()) as DeptNamesData[];
    } catch (error) {
      this.dept_names = [];
      console.error(error);
    }
  }

  async saveGuideChoice(data: any) {
    await this.postDataService.postData({...data, action: "SAVE"}, "");
  }

  async submitGuideChoice(data: any) {
    await this.postDataService.postData({...data, action: "SUBMIT"}, "");
  }
}


