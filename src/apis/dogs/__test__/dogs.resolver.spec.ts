import { CanActivate, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DogsResolver } from '../dogs.resolver';
import { DogsService } from '../dogs.service';
import { DOG_TYPE } from '../enum/dog-type.enum';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import * as httpMocks from 'node-mocks-http';
import { IContext } from 'src/commons/interface/context';
import { User } from 'src/apis/users/entities/user.entity';
import { CreateDogInput } from '../dto/create-dog.input';
import { UpdateDogInput } from '../dto/update-dog.input';

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

const UPDATED_MOCK_DOG = {
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

describe('DogsResolver', () => {
	let dogsResolver: DogsResolver;

	// Guard 통과 가정
	const mockAuthGuard: CanActivate = {
		canActivate: jest.fn().mockImplementation(() => true),
	};

	const context: IContext = {
		req: httpMocks.createRequest(),
		res: httpMocks.createResponse(),
	};
	context.req.user = new User();
	context.req.user.id = MOCK_USER.id;

	const mockDogsService = {
		findOneById: jest
			.fn() //
			.mockImplementation((id: string) => MOCK_DOG),
		findByUserId: jest
			.fn() //
			.mockImplementation((userId: string) => [MOCK_DOG]),
		create: jest
			.fn() //
			.mockImplementation(
				(createDogInput: CreateDogInput, userId: string) => MOCK_DOG,
			),
		updateOneById: jest
			.fn() //
			.mockImplementation(
				(id: string, updateDogInput: UpdateDogInput) => UPDATED_MOCK_DOG,
			),
		deleteOneById: jest
			.fn() //
			.mockImplementation((id: string, userId: string) => true),
	};

	beforeEach(async () => {
		const dogsModule = await Test.createTestingModule({
			providers: [
				DogsResolver, //
				{
					provide: DogsService,
					useValue: mockDogsService,
				},
				{
					provide: GqlAuthGuard,
					useValue: mockAuthGuard,
				},
			],
		}).compile();

		dogsResolver = dogsModule.get<DogsResolver>(DogsResolver);
	});

	it('dogsResolver가 정의되어야 함', () => {
		expect(dogsResolver).toBeDefined();
	});

	describe('fetchDog', () => {
		it('강아지 정보를 리턴해야 함', () => {
			expect(dogsResolver.fetchDog(MOCK_DOG.id)).toEqual({
				...MOCK_DOG,
			});
		});

		it('NotFoundException을 던져야 함', () => {
			const inValidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			try {
				dogsResolver.fetchDog(inValidMockId);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
			}
		});
	});

	describe('fetchUserDogs', () => {
		it('유저의 강아지 정보를 배열로 리턴해야 함', () => {
			expect(dogsResolver.fetchUserDogs(context)).toEqual([{ ...MOCK_DOG }]);
		});
	});

	describe('createDog', () => {
		it('생성한 강아지 정보를 리턴해야 함', () => {
			const createDogInput: CreateDogInput = {
				name: MOCK_DOG.name,
				age: MOCK_DOG.age,
				weight: MOCK_DOG.weight,
				breed: MOCK_DOG.breed,
				specifics: MOCK_DOG.specifics,
				image: MOCK_DOG.image,
			};

			expect(dogsResolver.createDog(createDogInput, context)).toEqual({
				...MOCK_DOG,
			});
		});
	});

	describe('updateDog', () => {
		it('업데이트한 강아지 정보를 리턴해야 함', () => {
			const updateDogInput: UpdateDogInput = {
				weight: UPDATED_MOCK_DOG.weight,
				breed: UPDATED_MOCK_DOG.breed,
			};

			expect(dogsResolver.updateDog(MOCK_DOG.id, updateDogInput)).toEqual({
				...UPDATED_MOCK_DOG,
			});
		});

		it('NotFoundException을 던져야 함', () => {
			const inValidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			const updateDogInput: UpdateDogInput = {
				weight: UPDATED_MOCK_DOG.weight,
				breed: UPDATED_MOCK_DOG.breed,
			};
			try {
				dogsResolver.updateDog(inValidMockId, updateDogInput);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
			}
		});
	});

	describe('deleteDog', () => {
		it('삭제 여부 true를 반환해야 함', () => {
			expect(dogsResolver.deleteDog(MOCK_DOG.id, context)).toBe(true);
		});

		it('NotFoundException을 던져야 함', () => {
			const inValidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			try {
				dogsResolver.deleteDog(inValidMockId, context);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
			}
		});
	});
});
