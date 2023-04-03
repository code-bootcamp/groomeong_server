import { Test, TestingModule } from '@nestjs/testing';
import { ShopImagesResolver } from '../shopImage.resolver';
import { ShopImagesService } from '../shopImage.service';
import { ShopImage } from '../entities/shopImages.entity';
import { UpdateShopImageInput } from '../dto/update-shopImage.input';
import { Shop } from 'src/apis/shops/entities/shop.entity';

// jest.mock('../shopImage.resolver');
jest.mock('../shopImage.service');

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

const EXAMPLE_SHOP_IMAGE: ShopImage = {
	id: '1e31187d-5c71-4bff-b124-d01081306e07',
	imageUrl: 'Test-url-222-asdfsadfasdf-asdfsadf',
	isThumbnail: true,
	shop: EXAMPLE_SHOP,
};

describe('ShopImagesResolver', () => {
	let shopImagesResolver: ShopImagesResolver;
	let shopImagesService: ShopImagesService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				ShopImagesResolver,
				{
					provide: ShopImagesService,
					useValue: {
						findThumbnailByShopId: jest.fn(),
						findByShopId: jest.fn(),
						save: jest.fn(),
						update: jest.fn(),
						delete: jest.fn(),
					},
				},
			],
		}).compile();

		shopImagesResolver = moduleRef.get<ShopImagesResolver>(ShopImagesResolver);
		shopImagesService = moduleRef.get<ShopImagesService>(ShopImagesService);
	});

	describe('fetchThumbnailByShop', () => {
		it('should return a ShopImage object', async () => {
			const shopImageMock: ShopImage = {
				id: '1',
				imageUrl: 'https://test.com/image.jpg',
				isThumbnail: true,
				shop: EXAMPLE_SHOP,
			};
			jest
				.spyOn(shopImagesService, 'findThumbnailByShopId')
				.mockResolvedValueOnce(shopImageMock);

			const result = await shopImagesResolver.fetchThumbnailByShop('1');

			expect(result).toBe(shopImageMock);
		});
	});

	describe('fetchShopImagesByShop', () => {
		it('should return an array of ShopImage objects', async () => {
			const shopImagesMock: ShopImage[] = [
				{
					id: '1',
					imageUrl: 'https://test.com/image1.jpg',
					isThumbnail: true,
					shop: EXAMPLE_SHOP,
				},
				{
					id: '2',
					imageUrl: 'https://test.com/image2.jpg',
					isThumbnail: false,
					shop: EXAMPLE_SHOP,
				},
			];
			jest
				.spyOn(shopImagesService, 'findByShopId')
				.mockResolvedValueOnce(shopImagesMock);

			const result = await shopImagesResolver.fetchShopImagesByShop('1');

			expect(result).toEqual(shopImagesMock);
		});
	});

	describe('createShopImage', () => {
		it('should return a ShopImage object', async () => {
			const input = {
				imageUrl: 'https://test.com/image.jpg',
				isThumbnail: true,
				shopId: EXAMPLE_SHOP.id,
			};
			const shopImageMock: ShopImage = {
				id: '1',
				imageUrl: input.imageUrl,
				isThumbnail: input.isThumbnail,
				shop: EXAMPLE_SHOP,
			};
			jest
				.spyOn(shopImagesService, 'save')
				.mockResolvedValueOnce(shopImageMock);

			const result = await shopImagesResolver.createShopImage(
				input.imageUrl,
				input.isThumbnail,
				input.shopId,
			);

			expect(result).toBe(shopImageMock);
		});
	});

	describe('updateShopImage', () => {
		const mockShopImage: ShopImage = {
			id: '123',
			imageUrl: 'https://example.com/image.png',
			isThumbnail: true,
			shop: EXAMPLE_SHOP,
		};

		const mockUpdateShopImageInput: UpdateShopImageInput = {
			id: '123',
			imageUrl: 'https://example.com/image.png',
			isThumbnail: true,
			shopId: EXAMPLE_SHOP.id,
		};

		jest.spyOn(shopImagesService, 'update').mockResolvedValue(mockShopImage);

		it('업데이트한 ShopImage 리턴해야함', async () => {
			const result = await shopImagesResolver.updateShopImage(
				mockUpdateShopImageInput,
			);
			expect(result).toEqual(mockShopImage);
		});
	});

	describe('deleteShopImage', () => {
		it('삭제 후 true 리턴해아함', async () => {
			const shopImageId = 'abc123';
			const expectedResult = true;

			jest.spyOn(shopImagesService, 'delete').mockResolvedValue(expectedResult);

			const result = await shopImagesResolver.deleteShopImage(shopImageId);

			expect(shopImagesService.delete).toHaveBeenCalledWith({ shopImageId });
			expect(result).toEqual(expectedResult);
		});
	});
});
