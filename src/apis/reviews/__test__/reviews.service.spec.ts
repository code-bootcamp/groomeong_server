import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShopsService } from 'src/apis/shops/shops.service';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { ReviewsService } from '../reviews.service';
import { Shop } from 'src/apis/shops/entities/shop.entity';

const EXAMPLE_REVIEW = {
	id: 'EXAMPLE_REVIEW_ID',
	contents: 'EXAMPLE_REVIEW_CONTENTS',
	createdAt: new Date(),
	star: 5,
	reservation: { id: '33bcbf41-884b-46f2-96a2-f3947a1ca906' },
	shop: { id: '500d75e0-0223-4046-be13-55887bfbf6f0' },
};

const EXAMPLE_SHOP = {
	id: '500d75e0-0223-4046-be13-55887bfbf6f0',
	name: '테스트1',
	phone: '01000000000',
	openHour: '13:00',
	closeHour: '15:00',
	address: '서울시 구로구',
	code: 11170,
	lat: '37.4944134',
	lng: '126.8563336',
	averageStar: 3,
	updatedAt: '2023-03-29 08:50:33',
	deletedAt: null,
	reservation: { id: '1' },
	image: { id: '1' },
	review: { id: '1' },
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ReviewsService', () => {
	let reviewsService: ReviewsService;
	let reviewsRepository: MockRepository<Review>;
	let shopsService: ShopsService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				ReviewsService,
				ShopsService,
				{
					provide: getRepositoryToken(Review),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Shop),
					useClass: Repository,
				},
			],
		}).compile();

		reviewsService = moduleRef.get<ReviewsService>(ReviewsService);
		shopsService = moduleRef.get<ShopsService>(ShopsService);
		reviewsRepository = moduleRef.get(getRepositoryToken(Review));
	});

	describe('find', () => {
		const review = new Review();

		it('DB에서 리뷰 가져와야함', async () => {
			jest.spyOn(reviewsRepository, 'findOne').mockResolvedValueOnce(review);
			expect(await reviewsService.find({ reviewId: '1' })).toBe(review);
		});

		it('DB에 리뷰가 없으면 UnprocessableEntityException 던져야 함', async () => {
			jest.spyOn(reviewsRepository, 'findOne').mockResolvedValueOnce(undefined);
			await expect(
				reviewsService.find({ reviewId: 'invalidId' }),
			).rejects.toThrowError('아이디를 찾을 수 없습니다');
		});
	});

	describe('findByShopIdWithPage', () => {
		const checkShop = new Shop();
		const reviews = [new Review()];

		it('DB에서 리뷰 가져와야함', async () => {
			jest.spyOn(shopsService, 'findById').mockResolvedValueOnce(checkShop);
			jest.spyOn(reviewsRepository, 'find').mockResolvedValueOnce(reviews);
			expect(
				await reviewsService.findByShopIdWithPage({
					page: 1,
					count: 10,
					shopId: '1',
				}),
			).toBe(reviews);
		});

		it('DB에 가게가 없으면 UnprocessableEntityException 던져야 함', async () => {
			jest.spyOn(shopsService, 'findById').mockResolvedValueOnce(undefined);
			await expect(
				reviewsService.findByShopIdWithPage({
					page: 1,
					count: 10,
					shopId: 'invalidId',
				}),
			).rejects.toThrowError('유효하지 않은 가게ID 입니다');
		});
	});

	describe('create', () => {
		it('새로운 리뷰 생성하고 별점평균 업데이트 해야함', async () => {
			const shopId = '1';
			const userId = '1';
			const createReviewInput = {
				contents: 'good',
				star: 4.5,
				reservationId: '1',
				shopId: '1',
			};
			const review = new Shop();
			const averageStar = 4.5;

			const averageStarSpy = jest
				.spyOn(reviewsService, 'averageStar')
				.mockResolvedValue(averageStar);
			const updateSpy = jest
				.spyOn(shopsService, 'update')
				.mockResolvedValue(review);

			jest.spyOn(reviewsRepository, 'save').mockResolvedValue(review);

			const result = await reviewsService.create({
				userId,
				createReviewInput,
			});

			expect(result).toEqual(review);
			expect(averageStarSpy).toHaveBeenCalledWith({ shopId });
			expect(updateSpy).toHaveBeenCalledWith({
				shopId,
				updateShopInput: { averageStar },
			});
		});
	});

	describe('averageStar', () => {
		it('별점 평균 계산', async () => {
			const shopId = 1;
			const reviews = [
				{
					id: '1',
					contents: '1',
					createdAt: new Date(2023 - 10 - 10),
					star: 5,
					reservation: { id: '1' },
					shop: { id: '1' },
				},
				{
					id: '2',
					contents: '2',
					createdAt: new Date(2023 - 12 - 12),
					star: 3,
					reservation: { id: '2' },
					shop: { id: '2' },
				},
				{
					id: '3',
					contents: '3',
					createdAt: new Date(2023 - 12 - 13),
					star: 4,
					reservation: { id: '3' },
					shop: { id: '3' },
				},
			];
			jest.spyOn(reviewsRepository, 'find').mockResolvedValue(reviews);

			const result = await reviewsService.averageStar({ shopId });

			expect(result).toBe(4);
		});
	});

	describe('checkReviewAuth', () => {
		it('리뷰 권한 확인 : 리뷰 작성 히스토리가 없으면 에러 리턴해야함', async () => {
			const reservationsByUser = [];
			const reviewsByUser = [];
			await expect(
				reviewsService.checkReviewAuth({ reservationsByUser, reviewsByUser }),
			).rejects.toThrow(
				'리뷰 작성 불가 : 이 회원은 예약서비스를 이용한 기록이 0건 입니다',
			);
		});

		it('리뷰 권한 확인 : 모든 예약건에 리뷰를 작성했다면 에러 리턴해야함', async () => {
			const reservationsByUser = [{ a: 1 }, { b: 2 }];
			const reviewsByUser = [{ c: 1 }, { d: 2 }];
			await expect(
				reviewsService.checkReviewAuth({ reservationsByUser, reviewsByUser }),
			).rejects.toThrow(
				'리뷰 작성 불가 : 이 회원은 모든 예약 건에 리뷰를 작성한 상태입니다',
			);
		});
	});
});
