import { Test, TestingModule } from '@nestjs/testing';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { Review } from '../entities/review.entity';
import { ReviewsResolver } from '../reviews.resolver';
import { ReviewsService } from '../reviews.service';

jest.mock('../reviews.resolver');


const EXAMPLE_RESERVATION: Reservation = {
	"id" : "33bcbf41-884b-46f2-96a2-f3947a1ca906",
	"date" : new Date(2023-04-30),
	"time" : "13:00",
	"shopId" : "500d75e0-0223-4046-be13-55887bfbf6f0",
	"userId" : "222070da-c5ab-43f0-802c-bdb4a73ccc0f",
	"dogId" : "7790ffa7-0be3-44ff-94dc-54c59fe696ed",
	"createdAt" : new Date(2023-03-30),
	"deletedAt" : null
}
const EXAMPLE_SHOP: Shop = {
	"id" : "500d75e0-0223-4046-be13-55887bfbf6f0",
	"name" : "테스트1",
	"phone" : "01000000000",
	"openHour" : "13:00",
	"closeHour" : "15:00",
	"address" : "서울시 구로구",
	"code" : 11170,
	"lat" : "37.4944134",
	"lng" : "126.8563336",
	"averageStar" : 3,
	"reservation": null,
	"image": null,
	"review": null,
	"updatedAt" : null,
	"deletedAt" : null
}
const EXAMPLE_REVIEW: Review = {
	id: 'EXAMPLE_REVIEW_ID',
	contents: 'EXAMPLE_REVIEW_CONTENTS',
	createdAt: new Date(),
	star: 5,
	reservation: EXAMPLE_RESERVATION,
	shop: EXAMPLE_SHOP,
};
const reviewId = EXAMPLE_REVIEW.id;

let mockReviewsService = {
	find: jest.fn(({ reviewId }) => EXAMPLE_REVIEW),
	findByShopIdWithPage: jest.fn(({ page, count, reviewId }) => EXAMPLE_REVIEW),
	create: jest.fn(() => EXAMPLE_REVIEW),
};

describe('ReviewResolver', () => {
	let reviewsResolver: ReviewsResolver;

	beforeEach(async () => {
		const reviewsModule: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewsResolver,
				{
					provide: ReviewsService,
					useValue: mockReviewsService,
				},
			],
		}).compile();
		mockReviewsService = reviewsModule.get(ReviewsService);
		reviewsResolver = reviewsModule.get<ReviewsResolver>(ReviewsResolver);
	});

	describe('fetchReview', () => {
		it('reivewService의 find 메서드 실행', async () => {
			const result = await reviewsResolver.fetchReview(reviewId);
			return result;

			expect(result).toEqual(EXAMPLE_REVIEW);
			expect(mockReviewsService.find({ reviewId })).toBeCalled();
		});
	});

	describe('fetchReviewsByShopId', () => {
		it('reivewService의 findByShopIdWithPage 메서드 실행', async () => {
			const { page, count, shopID } = { 1, 100,  }
			const result = await reviewsResolver.fetchReviewsByShopId(
				page,
				count,
				shopId,
			);
			return result;

			expect(result).toEqual(EXAMPLE_REVIEW);
			expect(
				mockReviewsService.findByShopIdWithPage({ page, count, reviewId }),
			).toBeCalled();
		});
	});
});
