import { StudentDataType } from "./GuideAllocationData";

export interface CoGuideAllocationType extends StudentDataType {
    coGuide?: GuideDataType | string;
  }