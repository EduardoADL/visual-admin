import axios from "axios";
import httpClient from "./httpClient";
import { IContact, IContactReponse } from "../interfaces/ContactsINterface";


export const ContactService = {
 
    async getAllContacts() {
        return httpClient.get<IContactReponse[]>('/contacts');
    },

    async postContacts(data:IContact) {
        const token = localStorage.getItem("token");
        return axios.post("https://visualnet.letsinove.com/contacts/", data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

    async putContacts(data:IContact, id:number) {
        const token = localStorage.getItem("token");
        return axios.put(`https://visualnet.letsinove.com/contacts/${id}`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, 
            },
        });
    },

        async deleteContacts(id:number) {
            return httpClient.delete(`/contacts/${id}`);
        },

};
