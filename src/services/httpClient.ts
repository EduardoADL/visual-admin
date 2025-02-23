import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
  } from 'axios';
  const api: AxiosInstance = axios.create({
    // baseURL: 'https://bank.virtu.srv.br/',
    baseURL: 'https://visualnet.letsinove.com',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const isAuthRequired = !config.headers['Skip-Authorization'];
  
      if (isAuthRequired) {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        delete config.headers.Authorization;
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error("Usuário não autorizado. Redirecionando para login...");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 307) {
        const redirectUrl = error.response.headers.location;
        if (redirectUrl) {
          return api.request({
            ...error.config,
            url: redirectUrl,
          });
        }
      }
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      console.error('Erro na resposta:', error);
      return Promise.reject(error.response?.data || error);
    }
  );
  
  export const httpClient = {
    get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await api.get<T>(url, config);
      return response.data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response = await api.post<T>(url, data, config);
      return response.data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response = await api.put<T>(url, data, config);
      return response.data;
    },
    delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await api.delete<T>(url, config);
      return response.data;
    },
  };
  
  export default httpClient;
  