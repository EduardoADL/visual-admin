import httpClient from "./httpClient";
import { IRating, IRatingResponse } from "../interfaces/RatingInteface";
import axios from "axios";


export const RatingService = {
 
    async getAllRating() {
        return httpClient.get<IRatingResponse[]>('/rates');
    },

    async postRating(data:IRating) {
        const token = localStorage.getItem("token");
        return axios.post("https://visualnet.letsinove.com/rates/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, 
              },
        });
    },

    async putRating(data:IRating, id:number) {
        const token = localStorage.getItem("token");
        return axios.put(`https://visualnet.letsinove.com/rates/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, 
              },
        });
    },

    async deleteRating(id:number) {
        return httpClient.delete(`/rates/${id}`);
    },

};
