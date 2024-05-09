export interface GuideData {
    id: number,
    name: string,
    dept_id: number,
    dept: string,
    specialization: string,
    imgUrl?: string
}

export interface DeptNamesData {
    id: number,
    name: string
}