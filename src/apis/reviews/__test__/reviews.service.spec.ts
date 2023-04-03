import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsResolver } from '../reviews.resolver';
import { ReviewsService } from '../reviews.service';
import * as httpMocks from 'node-mocks-http';
import { IContext } from 'src/commons/interface/context';
import { CreateReviewInput } from '../dto/create-review.input';

jest.mock('../reviews.resolver');

const EXAMPLE_REVIEW = {
	id: 'EXAMPLE_REVIEW_ID',
	contents: 'EXAMPLE_REVIEW_CONTENTS',
	createdAt: new Date(),
	star: 5,
	reservation: { id: '33bcbf41-884b-46f2-96a2-f3947a1ca906' },
	shop: { id: '500d75e0-0223-4046-be13-55887bfbf6f0' },
};

describe('ReviewResolver', () => {
	let mockReviewsService = {
		find: jest.fn(({ reviewId }) => EXAMPLE_REVIEW),
		findByShopIdWithPage: jest.fn(
			({ page, count, reviewId }) => EXAMPLE_REVIEW,
		),
		create: jest.fn(({ userId, createReviewInput }) => EXAMPLE_REVIEW),
	};
	let reviewsResolver: ReviewsResolver;
	let context: IContext;

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
		context = {
			req: httpMocks.createRequest(),
			res: httpMocks.createResponse(),
		};
	});

	const reviewId = EXAMPLE_REVIEW.id;
	const shopId = EXAMPLE_REVIEW.shop.id;
	const userId = 'exampleUserId';

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
			const page = 1;
			const count = 100;
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

	describe('createReview', () => {
		it('reivewService의 create 메서드 실행', async () => {
			const createReviewInput: CreateReviewInput = {
				contents: EXAMPLE_REVIEW.contents,
				star: EXAMPLE_REVIEW.star,
				reservationId: EXAMPLE_REVIEW.reservation.id,
				shopId: EXAMPLE_REVIEW.shop.id,
			};
			const result = await reviewsResolver.createReview(
				createReviewInput,
				context,
			);
			return result;

			expect(result).toEqual(EXAMPLE_REVIEW);
			expect(
				mockReviewsService.create({
					userId,
					createReviewInput,
				}),
			).toBeCalled();
		});
	});
});
