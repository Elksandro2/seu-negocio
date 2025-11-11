import { BaseService } from "./BaseService";

export class BusinessService extends BaseService {    

    async getAllCategories() {
        return this.handleRequest("get", "/businesses/categories");
    }

    async getBusinessesByCategory(categoryType) {
        return this.handleRequest("get", `/businesses/category/${categoryType}`);
    }

    async getBusinessById(businessId) {
        return this.handleRequest("get", `/businesses/${businessId}`);
    }

    async getMyBusinesses() {
        return this.handleRequest("get", "/businesses/me");
    }

    async createBusiness(businessData, logoFile) {
        const formData = new FormData();
        
        const businessRequestBlob = new Blob([JSON.stringify(businessData)], { type: "application/json" });
        
        formData.append("businessRequest", businessRequestBlob);
        
        if (logoFile) {
            formData.append("logo", logoFile);
        }

        return this.handleRequest("post", "/businesses", formData);
    }

    async updateBusiness(businessId, updateData) {
        return this.handleRequest("patch", `/businesses/${businessId}`, updateData);
    }

    async deleteBusiness(businessId) {
        return this.handleRequest("delete", `/businesses/${businessId}`);
    }
}