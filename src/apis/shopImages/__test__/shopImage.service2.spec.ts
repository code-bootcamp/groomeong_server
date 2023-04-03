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
						delete: jest.fn(),
					},
				},
			],
		}).compile();

		shopImagesService = module.get<ShopImagesService>(ShopImagesService);
		mockRepository = module.get(getRepositoryToken(ShopImage));
	});

	describe('findThumbnailByShopId', () => {
		it('썸네일 이미지 리턴해야함', async () => {
			const mockShopImage = new ShopImage();
			jest
				.spyOn(mockRepository, 'findOne')
				.mockResolvedValueOnce(mockShopImage);

			await shopImagesService.findThumbnailByShopId({ shopId });

			expect(mockRepository.findOne).toBeCalled();
		});

		it('썸네일이 없으면 UnprocessableEntityException 던져야 함', async () => {
			jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(undefined);

			expect(mockRepository.findOne).toBeCalled();
		});
	});

	describe('findByShopId', () => {
		it('한 가게의 모든 이미지 배열 리턴해야함', async () => {
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

		it('가게를 찾을 수 없는 경우 UnprocessableEntityException 던져야함', async () => {
			jest
				.spyOn(shopImagesService, 'findByShopId')
				.mockResolvedValueOnce(undefined);

			await expect(shopImagesService.findByShopId({ shopId })).rejects.toThrow(
				UnprocessableEntityException,
			);
			expect(shopImagesService.findByShopId).toHaveBeenCalledWith({ shopId });
		});
	});

	describe('save', () => {
		it('DB테이블에 신규 이미지 저장', async () => {
			const checkURL = jest.fn(({ shopId }) => EXAMPLE_SHOP_IMAGE);
			try {
				const shopId = EXAMPLE_SHOP_IMAGE.shop.id;
				await checkURL({ shopId });
			} catch (error) {
				expect(error).toBeInstanceOf(ConflictException);
				throw new ConflictException();
			}

			const result = mockRepository.save({
				imageUrl: EXAMPLE_SHOP_IMAGE.imageUrl,
				isThumbnail: EXAMPLE_SHOP_IMAGE.isThumbnail,
				shop: { id: EXAMPLE_SHOP_IMAGE.shop.id },
			});

			expect(checkURL).toBeCalledTimes(1);
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
		});
	});

	const updateShopImageInput = {
		imageUrl: EXAMPLE_SHOP_IMAGE.imageUrl,
		isThumbnail: EXAMPLE_SHOP_IMAGE.isThumbnail,
		shop: { id: EXAMPLE_SHOP_IMAGE.shop.id },
	};
	const shopImageId = EXAMPLE_SHOP_IMAGE.id;

	describe('update', () => {
		it('delete를 실행한 뒤 save를 실행한다', async () => {
			const shopImageId = EXAMPLE_SHOP_IMAGE.id;
			await mockRepository.delete(shopImageId);
			const result = mockRepository.save({
				imageUrl: EXAMPLE_SHOP_IMAGE.imageUrl,
				isThumbnail: EXAMPLE_SHOP_IMAGE.isThumbnail,
				shop: { id: EXAMPLE_SHOP_IMAGE.shop.id },
			});
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
		});
	});

	const checkImage = jest.fn(({ shopId }) => EXAMPLE_SHOP_IMAGE);
	describe('delete', () => {
		it('checkImage 통과 후 delete 실행', async () => {
			try {
				await checkImage({ shopId });
			} catch (error) {
				expect(error).toThrow(UnprocessableEntityException);
				throw new UnprocessableEntityException('아이디를 찾을 수 없습니다');
			}
			const result = await mockRepository.delete(shopImageId);
			expect(checkImage).toBeCalled();
			expect(result).toEqual(true);
		});
	});
});
