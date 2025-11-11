import { BaseService } from "./BaseService";

export class UserService extends BaseService {
    async login(email, password) {
        try {
            const response = await apiAxios.post("/user/login", { email, password });
            return { success: true, data: response.data };
        } catch (error) {
            const status = error.response?.status;
            let message = "Erro ao autenticar. Tente novamente.";

            if (status === 400 || status === 403) {
                message = "Credenciais inválidas. Verifique seu e-mail e senha.";
            }

            return { success: false, message };
        }
    }

    async register(userData, imageFile) {
        const formData = new FormData();
        const userRequestBlob = new Blob([JSON.stringify(userData)], { type: "application/json" });

        formData.append("userRequest", userRequestBlob);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        return this.handleRequest("post", "/user/register", formData);
    }

    async getUserData() {
        return this.handleRequest("get", "/user/me");
    }

    async updateProfilePicture(imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        return this.handleRequest("patch", "/user/picture", formData);
    }

    async updateUser(userId, userUpdate) {
        return this.handleRequest("patch", `/user/${userId}`, userUpdate);
    }

    async deleteUser(userId) {
        return this.handleRequest("delete", `/user/${userId}`);
    }
}