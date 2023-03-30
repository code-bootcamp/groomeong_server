import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsResolver } from '../reviews.resolver';
import { ReviewsService } from '../reviews.service';

jest.mock('../reviews.resolver');

const EXAMPLE_REVIEW = {
	id: "EXAMPLE_REVIEW_ID",
	contents: "EXAMPLE_REVIEW_CONTENTS",
	createdAt: new Date(),
	star: 5,
	reservation: {id : 'EXAMPLE_RESERVATION_ID'},
	shop: {id : 'EXAMPLE_SHOP_ID'}
}

describe('ReviewResolver', () => {
	let mockReviewsService = {
		find : jest.fn(() => EXAMPLE_REVIEW),
		findByShopIdWithPage : jest.fn(()=>EXAMPLE_REVIEW),
		create : jest.fn(()=> EXAMPLE_REVIEW)
	}
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
		mockReviewsService = reviewsModule.get<ReviewsService>(ReviewsService);
		reviewsResolver = reviewsResolver.get<ReviewsResolver>(ReviewsResolver);
	});

	describe('fetchReview', () => {
		it('reivewService의 find 메서드 실행', async () => {
			return await reviewsResolver.fetchReview({reviewId})
		});
	});
});
