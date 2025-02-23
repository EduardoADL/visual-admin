export interface IBannersResponse{
    id: number,
    imgName: string,
    name: string
}

export interface IBanner{
    name: string
    image: File | null | string
}