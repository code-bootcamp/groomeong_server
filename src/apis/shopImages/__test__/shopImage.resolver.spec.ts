import { Test, TestingModule } from '@nestjs/testing';
import { MockShopImagesResolver } from './shopImage.moking.dummy';

const Example_ShopImage = {
	id: '1e31187d-5c71-4bff-b124-d01081306e07',
	imageUrl: 'Test-url-222-asdfsadfasdf-asdfsadf',
	isThumbnail: true,
	shop: {
		id: '69f836c4-e0e4-4841-960d-2be40d150c44',
	},
};

describe('shopImagesResolver', () => {
	let mockShopImagesResolver: MockShopImagesResolver;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: MockShopImagesResolver,
					useClass: MockShopImagesResolver,
				},
			],
		}).compile();
		mockShopImagesResolver = module.get(MockShopImagesResolver);
	});

	describe('fetchThumbnailByShop', () => {
		it('가게이미지 중 썸네일 리턴해야함', async () => {
			const shopId = Example_ShopImage.shop.id;
			const myThumbnail = await mockShopImagesResolver.findThumbnailByShopId({
				shopId,
			});
			expect(myThumbnail.isThumbnail).toEqual(true);
		});
	});

	describe('fetchShopImagesByShop', () => {
		it('가게이미지 배열 리턴해야함', async () => {
			const shopId = Example_ShopImage.shop.id;
			const result = await mockShopImagesResolver.findByShopId({
				shopId,
			});
			const rightReturn = [
				{
					id: '370b960e-55d5-445b-935b-9fdfee36955c',
					imageUrl: 'Test-url-111-asdfsadfasdf-asdfsadf',
					isThumbnail: false,
					shop: {
						id: '69f836c4-e0e4-4841-960d-2be40d150c44',
					},
				},
				{
					id: '1e31187d-5c71-4bff-b124-d01081306e07',
					imageUrl: 'Test-url-222-asdfsadfasdf-asdfsadf',
					isThumbnail: true,
					shop: {
						id: '69f836c4-e0e4-4841-960d-2be40d150c44',
					},
				},
				{
					id: '958472c6-0dea-40c0-b9db-dbfa11cd630e',
					imageUrl: 'Test-url-444-asdfsadfasdf-asdfsadf',
					isThumbnail: false,
					shop: {
						id: '69f836c4-e0e4-4841-960d-2be40d150c44',
					},
				},
			];
			expect(result).toEqual(rightReturn);
		});
	});

	describe('createShopImage', () => {
		it('생성한 가게이미지 리턴해야함', async () => {
			const input = Example_ShopImage;
			const result = await mockShopImagesResolver.save({
				imageUrl: Example_ShopImage.imageUrl,
				isThumbnail: Example_ShopImage.isThumbnail,
				shopId: Example_ShopImage.shop.id,
			});

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
		});
	});

	describe('updateShopImage', () => {
		it('업데이트한 가게이미지 리턴해야함', async () => {
			const updateShopImageInput = Example_ShopImage;
			const result = await mockShopImagesResolver.updateShopImage({
				updateShopImageInput,
			});

			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
		});
	});

	describe('deleteShopImage', () => {
		it('boolean 리턴해야함', async () => {
			const input = Example_ShopImage;
			const removeIdx = mockShopImagesResolver.mydb.findIndex(
				(el) => el.id === input.id,
			);

			if (removeIdx !== -1) {
				mockShopImagesResolver.mydb.splice(removeIdx, 1);
			}

			const result = mockShopImagesResolver.mydb.some(
				(el) => el.id === input.id,
			);

			expect(result).toBe(false);
		});
	});
});
