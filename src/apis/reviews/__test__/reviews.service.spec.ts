import { UnprocessableEntityException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShopsService } from 'src/apis/shops/shops.service';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ReviewsService } from '../reviews.service';

jest.mock('../reviews.service');
const EXAMPLE_REVIEW = {
	id: 'EXAMPLE_REVIEW_ID',
	contents: 'EXAMPLE_REVIEW_CONTENTS',
	createdAt: new Date(),
	star: 5,
	reservation: { id: '33bcbf41-884b-46f2-96a2-f3947a1ca906' },
	shop: { id: '500d75e0-0223-4046-be13-55887bfbf6f0' },
};

const MockReviewsRepository = () => ({
	find: jest.fn((where, skip, take, order, relations) => {
		EXAMPLE_REVIEW;
	}),
	findOne: jest.fn((where, relations) => {
		EXAMPLE_REVIEW;
	}),
	save: jest.fn(({ contents, star, reservation, shop }) => {
		EXAMPLE_REVIEW;
	}),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReviewsService', () => {
	let reviewsService: ReviewsService;
	let shopsService: ShopsService;
	let mockReviewsRepository: MockRepository<Review>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewsService,
				{
					provide: getRepositoryToken(Review),
					useValue: MockReviewsRepository(),
				},
				{
					provide: ShopsService,
					useValue: {
						findById: jest.fn(() => true),
					},
				},
			],
		}).compile();

		reviewsService = module.get<ReviewsService>(ReviewsService);
		mockReviewsRepository = module.get(getRepositoryToken(Review));
	});

	const reviewId = EXAMPLE_REVIEW.id;
	const shopId = 'shopId';

	describe('find', () => {
		it('reviewsRepository의 findOne을 실행하고 값이 없으면 error 반환해야함', async () => {
			try {
				const result = await mockReviewsRepository.findOne({
					where: { id: reviewId },
					relations: ['shop', 'reservation'],
				});
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toEqual('아이디를 찾을 수 없습니다');
			}
			expect(mockReviewsRepository.findOne).toBeCalled();
		});
	});

	describe('findByShopIdWithPage', () => {
		it('', () => {
			try {
				shopsService.findById({ shopId });
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				throw new UnprocessableEntityException('유효하지 않은 가게ID 입니다');
			}
			const page = 1;
			const count = 12;
			const result = mockReviewsRepository.find({
				where: { shop: { id: shopId } },
				skip: (page - 1) * count,
				take: count,
				order: {
					createdAt: 'ASC',
				},
				relations: ['shop', 'reservation'],
			});

			expect(mockReviewsRepository.find).toBeCalled();
		});
	});

	describe('create', () => {
		it('', async () => {});
	});

	describe('averageStar', () => {
		it('', async () => {});
	});

	describe('checkReviewAuth', () => {
		it('', async () => {});
	});
});
