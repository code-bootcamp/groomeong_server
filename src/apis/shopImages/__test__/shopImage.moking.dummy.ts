export class MockShopImagesRepository {
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

	// id로 찾아오는 findOne
	findOne({ where }) {
		const shopImage = this.mydb.filter((el) => el.id === where.id);
		if (shopImage.length) {
			return shopImage[0];
		}
		return null;
	}

	// 저장
	save({ imageUrl, isThumbnail, shopId }) {
		const id = this.uuidv4();
		this.mydb.push({ id, imageUrl, isThumbnail, shop: { id: shopId } });
		return { imageUrl, isThumbnail, shop: { id: shopId } };
	}

	// id 기준으로 삭제
	delete({ where }) {
		const shopImage = this.mydb.filter((el) => el.id === where.id);
		const shopImageIdx = this.mydb.findIndex((el) => el.id === where.id);
		if (shopImage.length) {
			this.mydb.splice(shopImageIdx, 1);
			return true;
		}
		return false;
	}

	// 테스트용 id 생성을 위한 함수
	uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
			/[xy]/g,
			function (c) {
				const r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			},
		);
	}
}
