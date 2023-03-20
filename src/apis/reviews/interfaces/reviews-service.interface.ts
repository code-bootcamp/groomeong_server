import { CreateReviewInput } from '../dto/create-review.input';

export interface IReviewServiceCreate {
	createReviewInput: CreateReviewInput;
}

export interface IReviewServiceFindById {
	reviewId: string;
}

export interface IReviewServiceFindByUserId {
	userId: string;
}

export interface IReviewServiceFindByShopId {
	shopId: string;
}
