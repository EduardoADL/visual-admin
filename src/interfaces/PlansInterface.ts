export interface IPlan {
    mega_quantity: number,
    plan_type: string,
    value: number,
    description: string
}

export interface IPlanResponse {
    id:number,
    mega_quantity: number,
    plan_type: "RESIDENTIAL" | "BUSINESS",
    value: number,
    description: string
}