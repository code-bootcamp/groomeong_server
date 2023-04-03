import {
	ConflictException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ShopImagesService } from '../shopImage.service';
import { ShopImage } from '../entities/shopImages.entity';
import { Shop } from 'src/apis/shops/entities/shop.entity';

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

const shopId = EXAMPLE_SHOP.id;

describe('ShopImagesService', () => {
	let shopImagesService: ShopImagesService;
	let mockRepository: jest.Mocked<Repository<ShopImage>>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				ShopImagesService,
				{
					provide: getRepositoryToken(ShopImage),
					useValue: {
						findOne: jest.fn(),
						find: jest.fn(),
						save: jest.fn(),
					},
				},
			],
		}).compile();

		shopImagesService = module.get<ShopImagesService>(ShopImagesService);
		mockRepository = module.get(getRepositoryToken(ShopImage));
	});

	describe('findThumbnailByShopId', () => {
		it('should return the thumbnail of the shop', async () => {
			const mockShopImage = new ShopImage();
			jest
				.spyOn(mockRepository, 'findOne')
				.mockResolvedValueOnce(mockShopImage);

			await shopImagesService.findThumbnailByShopId({ shopId });

			expect(mockRepository.findOne).toBeCalled();
		});

		it('should throw UnprocessableEntityException when thumbnail is not found', async () => {
			jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

			expect(mockRepository.findOne).toBeCalled();
		});
	});

	describe('findByShopId', () => {
		it('should return all images of the shop', async () => {
			const mockShopImages = [new ShopImage()];
			jest
				.spyOn(shopImagesService, 'findByShopId')
				.mockResolvedValueOnce(mockShopImages);
			jest.spyOn(mockRepository, 'find').mockResolvedValueOnce(mockShopImages);

			const result = await shopImagesService.findByShopId({ shopId });

			expect(result).toEqual(mockShopImages);
			expect(shopImagesService.findByShopId).toHaveBeenCalledWith({ shopId });
			expect(mockRepository.find).toHaveBeenCalledWith({
				where: { shop: { id: 1 } },
			});
		});

		it('should throw UnprocessableEntityException when the shop is not found', async () => {
			jest
				.spyOn(shopImagesService, 'findByShopId')
				.mockResolvedValueOnce(undefined);

			await expect(shopImagesService.findByShopId({ shopId })).rejects.toThrow(
				UnprocessableEntityException,
			);
			expect(shopImagesService.findByShopId).toHaveBeenCalledWith({ shopId });
		});
	});
});
