export interface IRating {
    title: string,
    quality: number,
    name: string,
    image: File | null | string,
    message: string
}

export interface IRatingResponse {
    title: string,
    quality: number,
    name: string,
    imgName: string,
    id: number,
    message: string
}