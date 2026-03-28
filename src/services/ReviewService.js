import { BaseService } from "./BaseService";

export class ReviewService extends BaseService {
    async getReviewsByItem(itemId) {
        return this.handleRequest("get", `/reviews/item/${itemId}`);
    }
}