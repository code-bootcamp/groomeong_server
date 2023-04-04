import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsResolver } from '../reviews.resolver';
import { ReviewsService } from '../reviews.service';
import { Review } from '../entities/review.entity';

const EXAMPLE_REVIEW = {
	id: 'EXAMPLE_REVIEW_ID',
	contents: 'EXAMPLE_REVIEW_CONTENTS',
	createdAt: new Date(),
	star: 5,
	reservation: { id: '33bcbf41-884b-46f2-96a2-f3947a1ca906' },
	shop: { id: '500d75e0-0223-4046-be13-55887bfbf6f0' },
};

describe('ReviewsResolver', () => {
	let reviewsResolver: ReviewsResolver;
	let reviewsService: ReviewsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewsResolver,
				{
					provide: ReviewsService,
					useValue: {
						find: jest.fn(),
						findByShopIdWithPage: jest.fn(),
						create: jest.fn(),
						deleteOneById: jest.fn(),
					},
				},
			],
		}).compile();

		reviewsResolver = module.get<ReviewsResolver>(ReviewsResolver);
		reviewsService = module.get<ReviewsService>(ReviewsService);
	});

	describe('fetchReview', () => {
		it('should return a review by reviewId', async () => {
			const review = new Review();
			jest.spyOn(reviewsService, 'find').mockResolvedValueOnce(review);
			const result = await reviewsResolver.fetchReview(EXAMPLE_REVIEW.id);
			expect(reviewsService.find).toBeCalled();
		});
	});

	describe('fetchReviewsByShopId', () => {
		it('should return reviews by shopId', async () => {
			const reviews: Review[] = [new Review(), new Review()];
			const count = 100;
			const page = 1;
			jest
				.spyOn(reviewsService, 'findByShopIdWithPage')
				.mockResolvedValueOnce(reviews);
			const result = await reviewsResolver.fetchReviewsByShopId(
				page,
				count,
				EXAMPLE_REVIEW.shop.id,
			);
			expect(reviewsService.findByShopIdWithPage).toBeCalled();
		});
	});
});
