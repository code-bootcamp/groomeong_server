import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopsService } from '../shops.service';
import { Shop } from '../entities/shop.entity';

describe('ShopsService', () => {
	let shopsService: ShopsService;
	let shopsRepository: Repository<Shop>;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				ShopsService,
				{
					provide: getRepositoryToken(Shop),
					useClass: Repository,
				},
			],
		}).compile();

		shopsService = moduleRef.get<ShopsService>(ShopsService);
		shopsRepository = moduleRef.get<Repository<Shop>>(getRepositoryToken(Shop));
	});

	describe('findById', () => {
		it('should return a shop with the given ID', async () => {
			// given
			const shopId = '1';
			const shop = new Shop();
			jest.spyOn(shopsRepository, 'findOne').mockResolvedValueOnce(shop);

			// when
			const result = await shopsService.findById({ shopId });

			// then
			expect(result).toEqual(shop);
		});

		it('should throw an error if a shop with the given ID is not found', async () => {
			// given
			const shopId = '1';
			jest.spyOn(shopsRepository, 'findOne').mockResolvedValueOnce(undefined);

			// when
			const result = shopsService.findById({ shopId });

			// then
			await expect(result).rejects.toThrowError('가게를 찾을 수 없습니다');
		});
	});

	describe('create', () => {
		it('should create a new shop', async () => {
			// given
			const createShopInput = {
				name: 'New Shop',
				address: 'Seoul, Korea',
				phone: '01022221111',
				openHour: '09:00',
				closeHour: '17:00',
			};
			const lat = '37.1234';
			const lng = '127.1234';
			jest
				.spyOn(shopsService, 'getLatLngByAddress')
				.mockResolvedValueOnce([lat, lng]);
			jest.spyOn(shopsRepository, 'findOne').mockResolvedValueOnce(undefined);
			const newShop = new Shop();
			jest.spyOn(shopsRepository, 'save').mockResolvedValueOnce(newShop);

			// when
			const result = await shopsService.create({ createShopInput });

			// then
			expect(result).toEqual(newShop);
		});
	});
});
