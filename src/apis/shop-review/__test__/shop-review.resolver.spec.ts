import { Test } from '@nestjs/testing';
import { AddShopReviewService } from '../shop-review.service';
import { AddShopReviewResolver } from '../shop-review.resolver';
import { IContext } from 'src/commons/interface/context';
import { ShopWithAuthOutput } from '../dto/return-shop-review.output';
import * as httpMocks from 'node-mocks-http';

jest.mock('../shop-review.resolver');

const EXAMPLE_SHOP_AUTH: ShopWithAuthOutput = {
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
	hasReviewAuth: true,
};

describe('AddShopReviewResolver', () => {
	let addShopReviewService = {
		AddShopWithReviewAuth: jest.fn((shopId, context) => EXAMPLE_SHOP_AUTH),
	};
	let addShopReviewResolver: AddShopReviewResolver;
	let context: IContext;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				AddShopReviewResolver,
				{
					provide: AddShopReviewService,
					useValue: addShopReviewService,
				},
			],
		}).compile();
		addShopReviewResolver = moduleRef.get(AddShopReviewResolver);
		addShopReviewService = moduleRef.get(AddShopReviewService);
		context = {
			req: httpMocks.createRequest(),
			res: httpMocks.createResponse(),
		};
	});

	describe('fetchShopWithReviewAuth', () => {
		it('로그인되어있다면 AddShopWithReviewAuth 호출해야함', async () => {
			let shopId: '1';
			context.req.user = { id: '1', email: 'a@a.com' };

			const spyFn = jest.spyOn(addShopReviewService, 'AddShopWithReviewAuth');
			const result = await addShopReviewResolver.fetchShopWithReviewAuth(
				shopId,
				context,
			);

			expect(spyFn).toBeCalled();
			expect(result).toBe(EXAMPLE_SHOP_AUTH);
		});
	});
});
