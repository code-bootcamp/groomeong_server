import { Test, TestingModule } from '@nestjs/testing';
import { Review } from '../entities/review.entity';
import { ReviewsResolver } from '../reviews.resolver';
import { ReviewsService } from '../reviews.service';

jest.mock('../reviews.service');

describe('ReviewResolver', () => {
	let mockReviewsService: ReviewsService;
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
			await reviewsResolver.fetchReview;
		});
	});
});
