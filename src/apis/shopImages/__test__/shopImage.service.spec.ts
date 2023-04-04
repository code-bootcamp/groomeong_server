import {
	ConflictException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ShopImagesService } from '../shopImage.service';
import { MockShopImagesRepository } from './shopImage.moking.dummy';

const Example_ShopImage = {
	id: '1e31187d-5c71-4bff-b124-d01081306e07',
	imageUrl: 'Test-url-222-asdfsadfasdf-asdfsadf',
	isThumbnail: true,
	shop: {
		id: '69f836c4-e0e4-4841-960d-2be40d150c44',
	},
};
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

const mockShopImagesService = {
	findThumbnailByShopId: jest.fn((shopId: string) => {
		return Example_ShopImage;
	}),
};

describe('shopImagesService', () => {
	let mockShopImagesRepository: MockShopImagesRepository;
	let shopImagesService: ShopImagesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				{
					provide: ShopImagesService,
					useValue: mockShopImagesService,
				},
				{
					provide: MockShopImagesRepository,
					useClass: MockShopImagesRepository,
				},
			],
		}).compile();

		shopImagesService = module.get<ShopImagesService>(ShopImagesService);
		mockShopImagesRepository = module.get(MockShopImagesRepository);
	});
	const shopId = Example_ShopImage.shop.id;
	const imageUrl = Example_ShopImage.imageUrl;
	const isThumbnail = Example_ShopImage.isThumbnail;
	const checkShop = jest.fn(({ shopId }) => Example_ShopImage);
	const checkURL = jest.fn(({ imageUrl }) => Example_ShopImage);

	describe('findThumbnailByShopId', () => {
		it('checkShop을 통과하면 findOne 진행', async () => {
			try {
				await checkShop({ shopId });
			} catch (error) {
				expect(error).toThrow(UnprocessableEntityException);
			}

			const result = mockShopImagesRepository.findOne({
				where: { shop: { id: shopId }, isThumbnail: true },
				relations: ['shop'],
			});
			expect(checkShop).toBeCalledTimes(1);
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
			expect(result).toEqual(Example_ShopImage);
		});
	});

	describe('findByShopId', () => {
		it('checkShop을 통과하면 find 진행', async () => {
			try {
				await checkShop({ shopId });
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				throw new UnprocessableEntityException();
			}

			const result = mockShopImagesRepository.find({
				where: { shop: { id: shopId } },
			});

			expect(checkShop).toBeCalled();
			expect(result).toMatchObject(rightReturn);
		});
	});

	describe('save', () => {
		it('DB테이블에 신규 이미지 저장', async () => {
			try {
				await checkURL({ shopId });
			} catch (error) {
				expect(error).toBeInstanceOf(ConflictException);
				throw new ConflictException();
			}

			const result = mockShopImagesRepository.save({
				imageUrl: imageUrl,
				isThumbnail: isThumbnail,
				shop: { id: shopId },
			});

			expect(checkURL).toBeCalledTimes(1);
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
		});
	});

	const updateShopImageInput = {
		id: Example_ShopImage.id,
		imageUrl: Example_ShopImage.imageUrl,
		isThumbnail: Example_ShopImage.isThumbnail,
		shopId: Example_ShopImage.shop.id,
	};
	const shopImageId = Example_ShopImage.id;

	describe('update', () => {
		it('delete를 실행한 뒤 save를 실행한다', async () => {
			await mockShopImagesRepository.delete({ shopImageId });
			const result = mockShopImagesRepository.save({
				imageUrl: imageUrl,
				isThumbnail: isThumbnail,
				shop: { id: shopId },
			});
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('imageUrl');
			expect(result).toHaveProperty('isThumbnail');
			expect(result).toHaveProperty('shop');
		});
	});

	const checkImage = jest.fn(({ shopId }) => Example_ShopImage);
	describe('delete', () => {
		it('checkImage 통과 후 delete 실행', async () => {
			try {
				await checkImage({ shopId });
			} catch (error) {
				expect(error).toThrow(UnprocessableEntityException);
				throw new UnprocessableEntityException('아이디를 찾을 수 없습니다');
			}
			const result = await mockShopImagesRepository.delete({
				shopImageId,
			});
			expect(checkImage).toBeCalled();
			expect(result).toEqual(true);
		});
	});
});
