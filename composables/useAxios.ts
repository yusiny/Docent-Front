// composables/useAxios.ts
import axios, { type AxiosResponse, type AxiosRequestConfig } from "axios";
import { useUserStore } from "~/store/user";

interface BaseResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
}

export function useAxios() {
    const { SERVER_MODE, BASE_URL } = useRuntimeConfig().public;

    const API = axios.create({
        baseURL: BASE_URL,
        validateStatus: function (status) {
            return true;
        },
    });

    API.interceptors.request.use(
        (config) => {
            const { accessToken } = useUserStore();

            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const GET = async <T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<BaseResponse<T>> => {
        const response: AxiosResponse<BaseResponse<T>> = await API.get(
            url,
            config
        );
        return response.data;
    };

    const POST = async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<BaseResponse<T>> => {
        const response: AxiosResponse<BaseResponse<T>> = await API.post(
            url,
            data,
            config
        );
        return response.data;
    };

    const PUT = async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<BaseResponse<T>> => {
        const response: AxiosResponse<BaseResponse<T>> = await API.put(
            url,
            data,
            config
        );
        return response.data;
    };

    const PATCH = async <T>(
        url: string,
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<BaseResponse<T>> => {
        const response: AxiosResponse<BaseResponse<T>> = await API.patch(
            url,
            data,
            config
        );
        return response.data;
    };

    const DELETE = async <T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<BaseResponse<T>> => {
        const response: AxiosResponse<BaseResponse<T>> = await API.delete(
            url,
            config
        );
        return response.data;
    };

    return {
        API,
        GET,
        POST,
        PATCH,
        PUT,
        DELETE,
    };
}
