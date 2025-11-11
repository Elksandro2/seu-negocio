import { apiAxios } from "../axios/axiosConfig";
import { formatFieldErrors } from "../utils/errorUtils";

export class BaseService {
    async handleRequest(method, url, data = null) {

        const response = {
            data: {},
            message: "",
            success: false,
        };

        const config = {
            method,
            url,
            data,
            headers: {}
        };

        if (!(data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        }

        try {
            const res = await apiAxios(config);

            response.data = res.data;
            response.success = true;
        } catch (error) {
            const responseData = error.response?.data;

            if (error.response?.status === 401) {
                response.message = "Sessão expirada. Faça login novamente.";
            } else {
                response.message = formatFieldErrors(responseData);
            }
        }

        return response;
    }
}