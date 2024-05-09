import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CoGuideAllocationType } from '../models/CoGuideAllocationData';
import { PostDataService } from './post-data.service';

@Injectable({
  providedIn: 'root'
})
export class CoGuideAllocationService {
  constructor(private postDataService: PostDataService) { }
  coGuideAllocationData: CoGuideAllocationType[] = [];
  async fetchCoGuideAllocationData() {
    try {
      this.coGuideAllocationData = (await (
        await fetch(environment.COGUIDE_DATA_API)
      ).json()) as CoGuideAllocationType[];
    } catch (error) {
      this.coGuideAllocationData = [];
      console.error(error);
    }
  }

  async allocateCoGuide(data: any) {
    await this.postDataService.postData({...data, action: "ALLOCATE"}, "");
  }
}