import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopImage } from '../entities/shopImages.entity';
import { ShopImagesResolver } from '../shopImage.resolver';
import { ShopImagesService } from '../shopImage.service';
import { MockShopImagesRepository } from './shopImage.moking.dummy';

const shopImageResolverFetchThumbnailByShop = //
	jest.fn(() => ShopImage);
const shopImageResolverFetchShopImagesByShop = jest.fn(() =>
	//
	jest.fn(() => ShopImage),
);
const shopImageResolverCreateShopImage = jest.fn(() =>
	//
	jest.fn(() => ShopImage),
);
const shopImageResolverDeleteShopImage = jest.fn(() => true);
const Example_ShopIamge = {
	id: '1e31187d-5c71-4bff-b124-d01081306e07',
	imageUrl: 'Test-url-222-asdfsadfasdf-asdfsadf',
	isThumbnail: true,
	shop: {
		id: '69f836c4-e0e4-4841-960d-2be40d150c44',
	},
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthResolver', () => {
	let mockShopImagesRepository: MockShopImagesRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				//
			],
			providers: [
				//
				ShopImagesResolver,
				{
					provide: ShopImagesResolver,
					useClass: jest.fn(() => ({
						//
						fetchThumbnailByShop: shopImageResolverFetchThumbnailByShop,
						fetchShopImagesByShop: shopImageResolverFetchShopImagesByShop,
						createShopImage: shopImageResolverCreateShopImage,
						deleteShopImage: shopImageResolverDeleteShopImage,
					})),
				},
			],
		}).compile();

		mockShopImagesRepository = module.get(getRepositoryToken(ShopImage));
	});

	describe('AuthResolver', () => {
		it('가게이미지 중 썸네일 리턴해야함', async () => {
			const shopId = Example_ShopIamge.id;
			const myThumbnail = await mockShopImagesRepository.findOne({
				where: { isThumbnail: true, shop: { id: shopId } },
			});
			const result = myThumbnail.isThumbnail;

			expect(result).toBe(true);
		});

		it('가게이미지 리턴해야함', async () => {
			const shopId = Example_ShopIamge.id;
			const result = await mockShopImagesRepository.findOne({
				where: { shop: { id: shopId } },
			});
			const rightReturn = [
				{
					//
					id: '370b960e-55d5-445b-935b-9fdfee36955c',
					imageUrl: 'Test-url-111-asdfsadfasdf-asdfsadf',
					isThumbnail: false,
					shop: {
						//
						id: '69f836c4-e0e4-4841-960d-2be40d150c44',
					},
				},
				{
					//
					id: '1e31187d-5c71-4bff-b124-d01081306e07',
					imageUrl: 'Test-url-222-asdfsadfasdf-asdfsadf',
					isThumbnail: true,
					shop: {
						//
						id: '69f836c4-e0e4-4841-960d-2be40d150c44',
					},
				},
				{
					//
					id: '958472c6-0dea-40c0-b9db-dbfa11cd630e',
					imageUrl: 'Test-url-444-asdfsadfasdf-asdfsadf',
					isThumbnail: false,
					shop: {
						//
						id: '69f836c4-e0e4-4841-960d-2be40d150c44',
					},
				},
			];

			expect(result).toEqual(rightReturn);
		});

		it('가게이미지 리턴해야함', async () => {
			const input = Example_ShopIamge;
			const result = await mockShopImagesRepository.findOne({
				where: { id: input.id },
			});

			expect(result).toEqual(input);
		});

		it('boolean 리턴해야함', async () => {
			const input = Example_ShopIamge;
			const mydata = await mockShopImagesRepository.findOne({
				where: { id: input.id },
			});
			const removeIdx = mockShopImagesRepository.mydb.findIndex(
				(el) => el.id === input.id,
			);

			if (removeIdx !== -1) {
				mockShopImagesRepository.mydb.splice(removeIdx, 1);
			}

			const result = mockShopImagesRepository.mydb.some(
				(el) => el.id === input.id,
			);

			expect(result).toBe(false);
		});
	});
});
