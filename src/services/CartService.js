import { BaseService } from "./BaseService";

export class CartService extends BaseService {

    async getMyCart() {
        return this.handleRequest("get", "/cart/me");
    }

    async addItemToCart(itemId, quantity = 1, scheduledAt = null) {
        const cartRequest = { itemId, quantity };
        
        if (scheduledAt) {
            cartRequest.scheduledAt = scheduledAt;
        }

        return this.handleRequest("post", "/cart/items", cartRequest);
    }

    async updateItemQuantity(itemId, newQuantity) {
        const cartRequest = {
            itemId: itemId, 
            quantity: newQuantity,
        };

        return this.handleRequest("patch", `/cart/items/${itemId}`, cartRequest);
    }

    async removeItem(itemId) {
        return this.handleRequest("delete", `/cart/items/${itemId}`);
    }
}