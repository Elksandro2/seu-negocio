import { BaseService } from "./BaseService";

export class OrderService extends BaseService {
  async checkout() {
    return this.handleRequest("post", "/orders/checkout");
  }

  async getCustomerOrders() {
    return this.handleRequest("get", "/orders/customer");
  }

  async getSellerOrders() {
    return this.handleRequest("get", "/orders/seller");
  }
}