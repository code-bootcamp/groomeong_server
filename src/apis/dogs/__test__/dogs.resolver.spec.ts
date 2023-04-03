import { CanActivate, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DogsResolver } from '../dogs.resolver';
import { DogsService } from '../dogs.service';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import * as httpMocks from 'node-mocks-http';
import { IContext } from 'src/commons/interface/context';
import { User } from 'src/apis/users/entities/user.entity';
import { CreateDogInput } from '../dto/create-dog.input';
import { UpdateDogInput } from '../dto/update-dog.input';
import { MOCK_DOG, MOCK_USER, UPDATED_MOCK_DOG } from './dogs.mocking';

describe('DogsResolver', () => {
	let dogsResolver: DogsResolver;

	// Mock guard - guard 통과 가정
	const mockAuthGuard: CanActivate = {
		canActivate: jest.fn(() => true),
	};

	// Mock context
	const context: IContext = {
		req: httpMocks.createRequest(),
		res: httpMocks.createResponse(),
	};
	context.req.user = new User();
	context.req.user.id = MOCK_USER.id;

	// Mock service
	const mockDogsService = {
		findOneById: jest.fn(),
		findByUserId: jest.fn(),
		create: jest.fn(),
		updateOneById: jest.fn(),
		deleteOneById: jest.fn(),
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
		it('id에 해당하는 강아지 정보를 리턴해야 함', async () => {
			mockDogsService.findOneById.mockResolvedValueOnce(MOCK_DOG);

			const result = await dogsResolver.fetchDog(MOCK_DOG.id);
			expect(mockDogsService.findOneById).toHaveBeenCalledWith({
				id: MOCK_DOG.id,
			});
			expect(result).toEqual(MOCK_DOG);
		});

		it('강아지를 찾을 수 없는 경우 NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsService.findOneById.mockRejectedValue(
				new NotFoundException(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				),
			);

			expect(dogsResolver.fetchDog(invalidMockId)).rejects.toThrowError(
				new NotFoundException(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				),
			);
			expect(mockDogsService.findOneById).toHaveBeenCalledWith({
				id: invalidMockId,
			});
		});
	});

	describe('fetchUserDogs', () => {
		it('유저의 강아지 정보를 배열로 리턴해야 함', async () => {
			mockDogsService.findByUserId.mockResolvedValueOnce([MOCK_DOG]);

			const result = await dogsResolver.fetchUserDogs(context);
			expect(mockDogsService.findByUserId).toHaveBeenCalledWith({
				userId: context.req.user.id,
			});
			expect(result).toEqual([MOCK_DOG]);
		});
	});

	describe('createDog', () => {
		it('생성한 강아지 정보를 리턴해야 함', async () => {
			const createDogInput: CreateDogInput = {
				name: MOCK_DOG.name,
				age: MOCK_DOG.age,
				weight: MOCK_DOG.weight,
				breed: MOCK_DOG.breed,
				specifics: MOCK_DOG.specifics,
				image: MOCK_DOG.image,
			};
			mockDogsService.create.mockResolvedValueOnce(MOCK_DOG);

			const result = await dogsResolver.createDog(createDogInput, context);
			expect(mockDogsService.create).toHaveBeenCalledWith({
				createDogInput,
				userId: context.req.user.id,
			});
			expect(result).toEqual(MOCK_DOG);
		});
	});

	describe('updateDog', () => {
		it('업데이트한 강아지 정보를 리턴해야 함', async () => {
			const updateDogInput: UpdateDogInput = {
				weight: UPDATED_MOCK_DOG.weight,
				breed: UPDATED_MOCK_DOG.breed,
			};
			mockDogsService.updateOneById.mockResolvedValueOnce(UPDATED_MOCK_DOG);

			const result = await dogsResolver.updateDog(MOCK_DOG.id, updateDogInput);
			expect(mockDogsService.updateOneById).toHaveBeenCalledWith({
				id: MOCK_DOG.id,
				updateDogInput,
			});
			expect(result).toEqual(UPDATED_MOCK_DOG);
		});

		it('NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			const updateDogInput: UpdateDogInput = {
				weight: UPDATED_MOCK_DOG.weight,
				breed: UPDATED_MOCK_DOG.breed,
			};
			mockDogsService.updateOneById.mockRejectedValue(
				new NotFoundException(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				),
			);

			expect(
				dogsResolver.updateDog(invalidMockId, updateDogInput),
			).rejects.toThrowError(
				new NotFoundException(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				),
			);
			expect(mockDogsService.updateOneById).toHaveBeenCalledWith({
				id: invalidMockId,
				updateDogInput,
			});
		});
	});

	describe('deleteDog', () => {
		it('삭제 여부 true를 반환해야 함', async () => {
			mockDogsService.deleteOneById.mockResolvedValueOnce(true);

			const result = await dogsResolver.deleteDog(MOCK_DOG.id, context);

			expect(mockDogsService.deleteOneById).toHaveBeenCalledWith({
				id: MOCK_DOG.id,
				userId: context.req.user.id,
			});
			expect(result).toBe(true);
		});

		it('NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsService.deleteOneById.mockRejectedValue(
				new NotFoundException(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				),
			);

			expect(
				dogsResolver.deleteDog(invalidMockId, context),
			).rejects.toThrowError(
				new NotFoundException(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				),
			);
			expect(mockDogsService.deleteOneById).toHaveBeenCalledWith({
				id: invalidMockId,
				userId: context.req.user.id,
			});
		});
	});
});
