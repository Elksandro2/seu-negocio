import { BaseService } from "./BaseService";

export class ItemService extends BaseService {

    async getAllItems() {
        return this.handleRequest("get", "/items");
    }

    async getItemById(itemId) {
        return this.handleRequest("get", `/items/${itemId}`);
    }

    async createItem(itemData, imageFile) {
        const formData = new FormData();
        
        const itemRequestBlob = new Blob([JSON.stringify(itemData)], { type: "application/json" });
        
        formData.append("itemRequest", itemRequestBlob);
        
        if (imageFile) {
            formData.append("image", imageFile);
        }

        return this.handleRequest("post", "/items", formData);
    }

    async updateItem(itemId, updateData) {
        return this.handleRequest("patch", `/items/${itemId}`, updateData);
    }

    async deleteItem(itemId) {
        return this.handleRequest("delete", `/items/${itemId}`);
    }
}