import { describe, expect, test } from '@jest/globals';
import { ShopImage } from './entities/shopImages.entity';

class MockShopImageRepository {
	mydb = [
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
			id: 'c65366c0-2b7b-4a79-bff5-e4d8659a5e76',
			imageUrl: 'Test-url-333-asdfsadfasdf-asdfsadf',
			isThumbnail: false,
			shop: {
				//
				id: 'fecbeaa7-f83c-4cb6-a82f-ebbc1197e20e',
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
}

const shopImageServiceCreateShopImageMock: jest.Mock<Shop> = jest.fn(() => {
	//
});

// describe('', () => {
//   test(, () => {
//     expect().toBe();
//   });
// });
