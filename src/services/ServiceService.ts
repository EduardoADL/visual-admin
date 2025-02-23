import axios from "axios";
import { IService, IServiceResponse } from "../interfaces/ServiceInterface";
import httpClient from "./httpClient";


export const ServiceService = {
 
    async getAllService() {
        return httpClient.get<IServiceResponse[]>('/products');
    },

    async postService(data:IService) {
        const token = localStorage.getItem("token");
        return axios.post("https://visualnet.letsinove.com/products/", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

    async putService(data:IService, id:number) {
        const token = localStorage.getItem("token");
        return axios.put(`https://visualnet.letsinove.com/products/${id}`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

        async deleteService(id:number) {
            return httpClient.delete(`/products/${id}`);
        },

};
