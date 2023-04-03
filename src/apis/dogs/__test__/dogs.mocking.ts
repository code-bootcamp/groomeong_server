import { DOG_TYPE } from '../enum/dog-type.enum';

export const MOCK_USER = {
	id: 'c84fa63e-7a05-4cd5-b015-d4db9a262b18',
	name: '댕댕이주인',
	email: 'example@example.com',
	password: '$2b$10$RgW8TvWwmzlt2DH499dFuONDmeLdDaNxokZ6vL60iGgzoOMvbtuhy',
	phone: '01012341234',
	image:
		'https://storage.cloud.google.com/groomeong-storage/origin/profile/a6c16f50-2946-4dfb-9785-a782cea6c570/%03b%EF%BF%BD2.jpeg',
	createAt: '2023-03-21 12:00:02.011088',
	deleteAt: null,
	updateAt: '2023-03-21 12:00:02.011088',
};

export const MOCK_DOG = {
	id: '3ce6246c-f37a-426e-b95a-b38ec6d55f4e',
	name: '댕댕이',
	age: 5,
	weight: 4.5,
	breed: DOG_TYPE.SMALL,
	specifics: '성격이 착해요',
	image:
		'https://storage.cloud.google.com/groomeong-storage/origin/dog/a6c16f50-2946-4dfb-9785-a782cea6c570/%03b%EF%BF%BD2.jpeg',
	createdAt: '2023-03-21 12:13:02.011088',
	deletedAt: null,
	userId: 'c84fa63e-7a05-4cd5-b015-d4db9a262b18',
};

export const UPDATED_MOCK_DOG = {
	id: '3ce6246c-f37a-426e-b95a-b38ec6d55f4e',
	name: '댕댕이',
	age: 5,
	weight: 10.5,
	breed: DOG_TYPE.LARGE,
	specifics: '성격이 착해요',
	image:
		'https://storage.cloud.google.com/groomeong-storage/origin/dog/a6c16f50-2946-4dfb-9785-a782cea6c570/%03b%EF%BF%BD2.jpeg',
	createdAt: '2023-03-21 12:13:02.011088',
	deletedAt: null,
	userId: 'c84fa63e-7a05-4cd5-b015-d4db9a262b18',
};
