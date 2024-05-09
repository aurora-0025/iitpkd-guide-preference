export interface GuideDataType {
    id: number,
    name: string,
    dept_id: number,
    dept: string,
    specialization: string,
    imgUrl: string,
}

export interface StudentDataType {
    id: string;
    name: string;
    dept: string;
    imgUrl?: string;
    pendingGuideAllocation: GuideDataType[];
    allocatedGuide?: GuideDataType
}
