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

describe('shopImagesService', () => {
	let mockShopImagesRepository: MockShopImagesRepository;
	let shopImageService: ShopImagesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				//
			],
			providers: [
				//
				ShopImagesService,
				{
					provide: ShopImagesService,
					useClass: jest.fn(() => ({
						//
					})),
				},
			],
		}).compile();

		mockShopImagesRepository = module.get(getRepositoryToken(ShopImage));
		shopImageService = module.get<ShopImagesService>(ShopImagesService);
	});

	describe('findThumbnailByShopId', () => {
		it('가게ID로 썸네일 찾기', async () => {});
	});

	describe('findByShopId', () => {
		it('가게ID로 해당 이미지 찾기', async () => {});
	});

	describe('save', () => {
		it('DB테이블에 신규 이미지 저장', async () => {});
	});

	describe('DB테이블에서 이미지 삭제', () => {
		it('ddd', async () => {});
	});
});
