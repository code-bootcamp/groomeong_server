import {
	CanActivate,
	ExecutionContext,
	NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DogsResolver } from '../dogs.resolver';
import { DogsService } from '../dogs.service';
import { DOG_TYPE } from '../enum/dog-type.enum';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';

const MOCK_USER = {
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

const MOCK_DOG = {
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

// mock 서비스 만들기
const mockDogsService = {
	// mock 서비스 로직 만들기
	findOneById: jest.fn().mockImplementation((id: string) => {
		return MOCK_DOG;
	}),
};

const mockAuthGuard: CanActivate = {
	canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest();
		request.user = {
			email: 'liberty556@gmail.com',
			id: 'c84fa63e-7a05-4cd5-b015-d4db9a262b18',
		};
		return request.user;
	},
};

describe('DogsResolver', () => {
	let dogsResolver: DogsResolver;

	beforeEach(async () => {
		const dogsModule = await Test.createTestingModule({
			providers: [
				DogsResolver, //
				{
					provide: DogsService,
					useValue: mockDogsService,
				},
			],
		})
			.overrideGuard(GqlAuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		dogsResolver = dogsModule.get<DogsResolver>(DogsResolver);
	});

	it('dogsResolver가 정의되어야 함', () => {
		expect(dogsResolver).toBeDefined();
	});

	describe('fetchDog API', () => {
		it('강아지 정보를 리턴해야 함', () => {
			const validMockId = MOCK_DOG.id;
			expect(dogsResolver.fetchDog(validMockId)).toEqual({
				...MOCK_DOG,
			});
		});

		it('NotFoundException을 던져야 함', () => {
			const nonValidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			try {
				dogsResolver.fetchDog(nonValidMockId);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
			}
		});
	});
});
