import axios from "axios";
import { IBanner, IBannersResponse } from "../interfaces/BannersInterface";
import httpClient from "./httpClient";


export const BannersService = {
 
    async getAllBanners() {
        return httpClient.get<IBannersResponse[]>('/banners');
    },

    async deleteBanner(id:number) {
        return httpClient.delete(`/banners/${id}`);
    },

    async postBanner(data:IBanner) {
        const token = localStorage.getItem("token");
        return axios.post("https://visualnet.letsinove.com/banners/", data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

    async putBanner(data:IBanner, id:number) {
        const token = localStorage.getItem("token");
        return axios.put(`https://visualnet.letsinove.com/banners/${id}`, data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, 
            },
        });
    },
};
