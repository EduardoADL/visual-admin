import axios from "axios";
import { IPlan, IPlanResponse } from "../interfaces/PlansInterface";
import httpClient from "./httpClient";


export const PlanService = {
 
    async getAllPlans() {
        return httpClient.get<IPlanResponse[]>('/plans');
    },

    async postPlan(data:IPlan) {
        const token = localStorage.getItem("token");
        return axios.post("https://visualnet.letsinove.com/plans/", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

    async putPlan(data:IPlan, id:number) {
        const token = localStorage.getItem("token");
        return axios.put(`https://visualnet.letsinove.com/plans/${id}`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

        async deletePlan(id:number) {
            return httpClient.delete(`/plans/${id}`);
        },

};
