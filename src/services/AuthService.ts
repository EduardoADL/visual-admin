import { ILogin, ILoginResponse } from "../interfaces/AuthInterface";

import httpClient from "./httpClient";

export const AuthService = {
    async login(data: ILogin) {
      const params = new URLSearchParams();
      params.append("username", data.username);
      params.append("password", data.password);
  
      return httpClient.post<ILoginResponse>('/login', params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
  };
