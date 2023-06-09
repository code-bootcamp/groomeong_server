export const MOCK_RESERVATION = {
	id: '6b7a693d-f0db-4e98-bddd-d855f5324ecb',
	date: new Date('2023-03-31'),
	time: '19:00',
	createdAt: '2023-03-30 00:55:19.960721',
	deletedAt: null,
	shop: {
		id: '89a3c0c1-60db-4725-8e65-b33a95acb800',
	},
	user: {
		id: 'c7fb31dd-a6d1-4d9a-9b91-d3dd9e40f8c8',
	},
	dog: {
		id: '64acf5f8-95bf-4256-8a23-8b073fb02c42',
	},
};

export const MOCK_SHOP = {
	id: '89a3c0c1-60db-4725-8e65-b33a95acb800',
	name: '서현펫',
	phone: '01012341234',
	openHour: '11:00',
	closeHour: '21:00',
	address: '서울 양천구 목동 739-11 1층',
	code: 11150,
	lat: 37.5382114,
	lng: 126.866754,
	averageStar: 5,
	updatedAt: '2023-03-30 01:03:12',
	deletedAt: null,
};

export const MOCK_REVIEW = {
	id: '3f50f151-55ba-4e1b-a5dc-8f08f2bc9394',
	contents: '너무 이쁘게 잘라주세요',
	createdAt: '2023-03-30 01:03:12.261083',
	star: 4,
	reservationId: 'e9b15e1d-a71b-4dcf-841f-16f99f6f91f8',
	shopId: '89a3c0c1-60db-4725-8e65-b33a95acb800',
};
