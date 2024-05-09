import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StudentDataType } from '../models/GuideAllocationData';
import { PostDataService } from './post-data.service';

@Injectable({
  providedIn: 'root'
})
export class GuideAllocationService {
  constructor(private postDataService: PostDataService) { }
  guideAllocationData: StudentDataType[] = [];
  async fetchGuideAllocationData() {
    try {
      this.guideAllocationData = (await (
        await fetch(environment.GUIDE_ALLOCATION_DATA_API)
      ).json()) as StudentDataType[];
    } catch (error) {
      this.guideAllocationData = [];
      console.error(error);
    }
  }

  async allocateGuide(data: any) {
    await this.postDataService.postData({...data, action: "ALLOCATE"}, "");
  }
}