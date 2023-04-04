import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from 'src/apis/reviews/reviews.service';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { ShopsService } from 'src/apis/shops/shops.service';

jest.mock('src/apis/shops/shops.service');
jest.mock('src/apis/reviews/reviews.service');

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

describe('AddShopReviewService', () => {
	let mockShopsRepository = {
		find: jest.fn(({ where }) => EXAMPLE_SHOP),
	};
	let reviewsService: ReviewsService;
	let shopsService: ShopsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: mockShopsRepository,
					useValue: mockShopsRepository,
				},
				{
					provide: reviewsService,
					useValue: {},
				},
			],
		});
	});
});
