import { BaseService } from "./BaseService";

export class AdminService extends BaseService {
    async getAllBusinesses() {
        return this.handleRequest("get", "/admin/businesses");
    }

    async deleteBusiness(businessId) {
        return this.handleRequest("delete", `/admin/businesses/${businessId}`);
    }

    async getAllUsers() {
        return this.handleRequest("get", "/admin/users");
    }

    async deleteUser(userId) {
        return this.handleRequest("delete", `/admin/users/${userId}`);
    }
}