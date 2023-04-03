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
import { getRepositoryToken } from '@nestjs/typeorm';
import { Dog } from '../entities/dog.entity';
import { DOG_TYPE } from '../enum/dog-type.enum';

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

	// Mock Repository
	const mockDogsRepository = {
		findOne: jest.fn(),
		findBy: jest.fn(),
		save: jest.fn(),
		softDelete: jest.fn(),
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
					provide: getRepositoryToken(Dog),
					useValue: mockDogsRepository,
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
			mockDogsRepository.findOne.mockImplementation(
				(where: { id: string }, relations: { user: true }) => MOCK_DOG,
			);
			mockDogsService.findOneById.mockImplementation((id: string) => MOCK_DOG);

			const result = await dogsResolver.fetchDog(MOCK_DOG.id);
			expect(result).toEqual(MOCK_DOG);
			expect(mockDogsService.findOneById).toHaveBeenCalledWith({
				id: MOCK_DOG.id,
			});
		});

		it('강아지를 찾을 수 없는 경우 NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsRepository.findOne.mockImplementation(
				(where: { id: string }) => null,
			);

			try {
				dogsResolver.fetchDog(invalidMockId);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				);
			}
		});
	});

	describe('fetchUserDogs', () => {
		it('유저의 강아지 정보를 배열로 리턴해야 함', async () => {
			mockDogsRepository.findBy.mockImplementation(
				(user: { id: string }) => [MOCK_DOG], //
			);
			mockDogsService.findByUserId.mockImplementation((userId: string) => [
				MOCK_DOG,
			]);

			const result = await dogsResolver.fetchUserDogs(context);
			expect(result).toEqual([MOCK_DOG]);
			expect(mockDogsService.findByUserId).toHaveBeenCalledWith({
				userId: context.req.user.id,
			});
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
			mockDogsRepository.save.mockImplementation(
				(createDogInput: CreateDogInput, user: { id: string }) => MOCK_DOG,
			);
			mockDogsService.create.mockImplementation(
				(createDogInput: CreateDogInput, userId: string) => MOCK_DOG,
			);

			const result = await dogsResolver.createDog(createDogInput, context);
			expect(result).toEqual(MOCK_DOG);
			expect(mockDogsService.create).toHaveBeenCalledWith({
				createDogInput,
				userId: context.req.user.id,
			});
		});
	});

	describe('updateDog', () => {
		const updateDogInput: UpdateDogInput = {
			weight: UPDATED_MOCK_DOG.weight,
			breed: UPDATED_MOCK_DOG.breed,
		};

		it('업데이트한 강아지 정보를 리턴해야 함', async () => {
			mockDogsRepository.findOne.mockImplementation(
				(where: { id: string }, relations: { user: true }) => MOCK_DOG,
			);
			mockDogsService.findOneById.mockImplementation((id: string) => MOCK_DOG);
			mockDogsRepository.save.mockImplementation(
				(
					id: string,
					name: string,
					age: number,
					weight: number,
					breed: DOG_TYPE,
					specifics: string,
					image: string,
					createdAt: Date,
					deleledAt: Date,
					userId: string,
				) => UPDATED_MOCK_DOG,
			);
			mockDogsService.updateOneById.mockImplementation(
				(id: string, updateDogInput: UpdateDogInput) => UPDATED_MOCK_DOG,
			);

			const result = await dogsResolver.updateDog(MOCK_DOG.id, updateDogInput);
			expect(result).toEqual(UPDATED_MOCK_DOG);
			expect(mockDogsService.updateOneById).toHaveBeenCalledWith({
				id: MOCK_DOG.id,
				updateDogInput,
			});
		});

		it('NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsRepository.findOne.mockImplementation(
				(where: { id: string }) => null,
			);

			try {
				dogsResolver.updateDog(invalidMockId, updateDogInput);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				);
			}
			expect(mockDogsService.updateOneById).toHaveBeenCalledWith({
				id: invalidMockId,
				updateDogInput,
			});
		});
	});

	describe('deleteDog', () => {
		it('삭제 여부 true를 반환해야 함', async () => {
			mockDogsRepository.findOne.mockImplementation(
				(where: { id: string }) => MOCK_DOG,
			);
			mockDogsRepository.softDelete.mockImplementation(
				(id: string, user: { id: string }) => 1,
			);
			mockDogsService.deleteOneById.mockImplementation(
				(id: string, userId: string) => true,
			);

			const result = await dogsResolver.deleteDog(MOCK_DOG.id, context);
			expect(result).toBe(true);
			expect(mockDogsService.deleteOneById).toHaveBeenCalledWith({
				id: MOCK_DOG.id,
				userId: context.req.user.id,
			});
		});

		it('NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsRepository.findOne.mockImplementation(
				(where: { id: string }) => null,
			);

			try {
				dogsResolver.deleteDog(invalidMockId, context);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`id ${invalidMockId}를 갖는 강아지를 찾을 수 없음`,
				);
			}
			expect(mockDogsService.deleteOneById).toHaveBeenCalledWith({
				id: invalidMockId,
				userId: context.req.user.id,
			});
		});
	});
});
