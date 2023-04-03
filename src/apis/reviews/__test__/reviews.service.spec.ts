import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ShopsService } from 'src/apis/shops/shops.service';
import { ReviewsService } from '../reviews.service';
import { Shop } from 'src/apis/shops/entities/shop.entity';

const EXAMPLE_SHOP: Shop = {
	id: '1',
	name: '1',
	phone: '1',
	openHour: '1',
	closeHour: '1',
	address: '1',
	code: 123,
	lat: '1',
	lng: '1',
	averageStar: 3,
	reservation: null,
	image: null,
	review: null,
	updatedAt: new Date(),
	deletedAt: null,
};

describe('ReviewsService', () => {
	let reviewsService: ReviewsService;
	let mockRepository: jest.Mocked<Repository<Review>>;
	let mockShopsService: jest.Mocked<ShopsService>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ReviewsService,
				{
					provide: getRepositoryToken(Review),
					useValue: {
						findOne: jest.fn(),
						find: jest.fn(),
						save: jest.fn(),
					},
				},
				{
					provide: ShopsService,
					useValue: {
						findById: jest.fn(),
						update: jest.fn(),
					},
				},
			],
		}).compile();

		reviewsService = module.get<ReviewsService>(ReviewsService);
		mockRepository = module.get(getRepositoryToken(Review));
		mockShopsService = module.get(ShopsService);
	});

	describe('find', () => {
		it('reviewsService 의 find를 실행해야함', async () => {
			const review = new Review();
			const reviewId = 'valid-review-id';
			mockRepository.findOne.mockReturnValue(Promise.resolve(review));

			const result = await reviewsService.find({ reviewId });

			expect(result).toBe(review);
			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: reviewId },
				relations: ['shop', 'reservation'],
			});
		});

		it('reviewId가 잘못되었을 때 UnprocessableEntityException 반환해야함', async () => {
			const reviewId = 'invalid-review-id';
			mockRepository.findOne.mockReturnValue(undefined);

			await expect(reviewsService.find({ reviewId })).rejects.toThrow(
				UnprocessableEntityException,
			);
			expect(mockRepository.findOne).toHaveBeenCalledWith({
				where: { id: reviewId },
				relations: ['shop', 'reservation'],
			});
		});
	});

	describe('findByShopIdWithPage', () => {
		it('shopsService의 findById 실행해야함', async () => {
			const reviews = [new Review(), new Review()];
			const page = 1;
			const count = 10;
			mockShopsService.findById.mockResolvedValue(EXAMPLE_SHOP);
			mockRepository.find.mockReturnValue(Promise.resolve(reviews));

			const shopId = 'invalid-shop-id';
			const result = await reviewsService.findByShopIdWithPage({
				page,
				count,
				shopId,
			});

			expect(result).toBe(reviews);
			expect(mockShopsService.findById).toHaveBeenCalledWith({ shopId });
			expect(mockRepository.find).toHaveBeenCalledWith({
				where: { shop: { id: shopId } },
				skip: (page - 1) * count,
				take: count,
				order: { createdAt: 'ASC' },
				relations: ['shop', 'reservation'],
			});
		});
	});

	describe('create', () => {
		it('리뷰 생성하고 shop의 별점평균 업데이트 해야함', async () => {
			const userId = 'test-user-id';
			const createReviewInput = {
				shopId: 'test-shop-id',
				reservationId: 'test-reservation-id',
				contents: 'test-contents',
				star: 4.5,
			};
			const review = new Review();
			const _averageStar = 4.5;
			mockRepository.save.mockResolvedValue(review);
			mockRepository.findOne.mockResolvedValue(review);
			mockShopsService.update.mockResolvedValue(undefined);
			mockRepository.find.mockResolvedValue([]);

			const result = await reviewsService.create({
				userId,
				createReviewInput,
			});

			expect(result).toBe(review);
			expect(mockRepository.save).toHaveBeenCalled();
			expect(mockRepository.find).toHaveBeenCalled();
			expect(mockShopsService.update).toHaveBeenCalled();
		});
	});
});
