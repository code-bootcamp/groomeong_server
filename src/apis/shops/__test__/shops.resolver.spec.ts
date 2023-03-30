import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import * as supertest from 'supertest';
import { ShopsResolver } from '../shops.resolver';
import { ShopsService } from '../shops.service';

describe('ShopsResolver', () => {
	let resolver: ShopsResolver;
	let service: ShopsService;
	let elasticsearchService: ElasticsearchService;
	let app;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ShopsResolver,
				{
					provide: ShopsService,
					useValue: {
						sortByAvgStar: jest.fn(),
						findAll: jest.fn(),
						findById: jest.fn(),
						create: jest.fn(),
						update: jest.fn(),
					},
				},
				{
					provide: ElasticsearchService,
					useValue: {
						search: jest.fn(),
					},
				},
			],
		}).compile();

		resolver = module.get<ShopsResolver>(ShopsResolver);
		service = module.get<ShopsService>(ShopsService);
		elasticsearchService =
			module.get<ElasticsearchService>(ElasticsearchService);

		app = module.createNestApplication();
		await app.init();
	});

	describe('autocompleteShops', () => {
		it('should return an array of AutocompleteShopsOutput', async () => {
			const result = [{ name: 'shop1' }, { name: 'shop2' }];
			(elasticsearchService.search as jest.Mock).mockReturnValueOnce({
				body: {
					hits: {
						hits: result,
					},
				},
			});
			(service.sortByAvgStar as jest.Mock).mockReturnValueOnce(result);

			const response = await supertest(app.getHttpServer())
				.post('/graphql')
				.send({
					query: `
            query {
              autocompleteShops(search: "test") {
                name
              }
            }
          `,
				})
				.expect(200);

			expect(response.body.data.autocompleteShops).toEqual(result);
		});
	});

	describe('fetchShops', () => {
		it('should return an array of Shop', async () => {
			const result = [{ name: 'shop1' }, { name: 'shop2' }];
			(service.findAll as jest.Mock).mockReturnValueOnce(result);

			const response = await supertest(app.getHttpServer())
				.post('/graphql')
				.send({
					query: `
            query {
              fetchShops(page: 1, count: 10) {
                name
              }
            }
          `,
				})
				.expect(200);

			expect(response.body.data.fetchShops).toEqual(result);
		});
	});

	describe('fetchShop', () => {
		it('should return a Shop', async () => {
			const result = { name: 'shop1' };
			(service.findById as jest.Mock).mockReturnValueOnce(result);

			const response = await supertest(app.getHttpServer())
				.post('/graphql')
				.send({
					query: `
            query {
              fetchShop(shopId: "test") {
                name
              }
            }
          `,
				})
				.expect(200);

			expect(response.body.data.fetchShop).toEqual(result);
		});
	});
});
