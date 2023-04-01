import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DogsService } from '../dogs.service';
import { CreateDogInput } from '../dto/create-dog.input';
import { UpdateDogInput } from '../dto/update-dog.input';
import { Dog } from '../entities/dog.entity';
import { MOCK_DOG, MOCK_USER, UPDATED_MOCK_DOG } from './dogs.mocking';

describe('DogsService', () => {
	let dogsService: DogsService;
	const mockDogsRepository = {
		findOne: jest.fn(),
		findBy: jest.fn(),
		save: jest.fn(),
		softDelete: jest.fn(),
	};

	beforeEach(async () => {
		const dogsModule = await Test.createTestingModule({
			providers: [
				DogsService,
				{
					provide: getRepositoryToken(Dog), //
					useValue: mockDogsRepository,
				},
			],
		}).compile();

		dogsService = dogsModule.get<DogsService>(DogsService);
	});

	it('dogsService가 정의되어야 함', () => {
		expect(dogsService).toBeDefined();
	});

	describe('findOneById', () => {
		it('강아지를 찾지 못하면 NotFoundException을 던져야 함', () => {
			const inValidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';

			mockDogsRepository.findOne.mockResolvedValueOnce(null);
			expect(
				dogsService.findOneById({ id: inValidMockId }),
			).rejects.toThrowError(NotFoundException);
		});

		it('id에 해당하는 강아지 정보를 리턴해야 함', async () => {
			const validMockId = MOCK_DOG.id;

			mockDogsRepository.findOne.mockResolvedValueOnce(MOCK_DOG);
			const result = await dogsService.findOneById({ id: validMockId });
			expect(result).toEqual(MOCK_DOG);
		});
	});

	describe('findByUserId', () => {
		it('유저의 강아지 정보를 배열로 리턴해야 함', async () => {
			const mockUserId = MOCK_DOG.userId;
			const mockDogs = [
				MOCK_DOG, //
				{ ...MOCK_DOG },
				{ ...MOCK_DOG },
			];
			mockDogsRepository.findBy.mockResolvedValueOnce(mockDogs);
			const result = await dogsService.findByUserId({ userId: mockUserId });
			expect(result).toEqual(mockDogs);
		});

		it('유저의 강아지 정보가 없다면 빈 배열을 리턴해야 함', async () => {
			const mockUserId = 'c84fa63e-7a05-4cd5-b015-d4db9a262b11';
			mockDogsRepository.findBy.mockResolvedValueOnce([]);
			const result = await dogsService.findByUserId({ userId: mockUserId });
			expect(result).toEqual([]);
		});
	});

	describe('create', () => {
		it('강아지를 생성하고 생성한 강아지 정보를 리턴해야 함', async () => {
			const createDogInput: CreateDogInput = {
				name: MOCK_DOG.name,
				age: MOCK_DOG.age,
				breed: MOCK_DOG.breed,
				weight: MOCK_DOG.weight,
				specifics: MOCK_DOG.specifics,
				image: MOCK_DOG.image,
			};
			const createdDog = {
				id: MOCK_DOG.id,
				name: MOCK_DOG.name,
				age: MOCK_DOG.age,
				breed: MOCK_DOG.breed,
				weight: MOCK_DOG.weight,
				specifics: MOCK_DOG.specifics,
				image: MOCK_DOG.image,
				createdAt: new Date(),
				deletedAt: null,
				userId: MOCK_USER.id,
			};
			mockDogsRepository.save.mockResolvedValueOnce(createdDog);

			const result = await dogsService.create({
				createDogInput,
				userId: MOCK_USER.id,
			});
			expect(result).toEqual(createdDog);
		});
	});

	describe('updateOneById', () => {
		const updateDogInput: UpdateDogInput = {
			name: UPDATED_MOCK_DOG.name,
			age: UPDATED_MOCK_DOG.age,
			weight: UPDATED_MOCK_DOG.weight,
			breed: UPDATED_MOCK_DOG.breed,
			image: UPDATED_MOCK_DOG.image,
			specifics: UPDATED_MOCK_DOG.specifics,
		};

		it('강아지를 찾지 못하면 NotFoundException을 던져야 함', () => {
			const inValidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsRepository.findOne.mockResolvedValueOnce(null);
			expect(
				dogsService.updateOneById({ id: inValidMockId, updateDogInput }),
			).rejects.toThrowError(NotFoundException);
		});

		it('업데이트한 강아지 정보를 리턴해야 함', async () => {
			mockDogsRepository.findOne.mockResolvedValueOnce(MOCK_DOG);
			mockDogsRepository.save.mockResolvedValueOnce(UPDATED_MOCK_DOG);

			const result = await dogsService.updateOneById({
				id: MOCK_DOG.id,
				updateDogInput,
			});
			expect(result).toEqual(UPDATED_MOCK_DOG);
		});
	});

	describe('deleteOneById', () => {
		it('강아지를 찾지 못하면 NotFoundException을 던져야 함', () => {
			const invalidMockId = '3ce6246c-f37a-426e-b95a-b38ec6d55f4f';
			mockDogsRepository.findOne.mockResolvedValueOnce(null);
			expect(
				dogsService.deleteOneById({ id: invalidMockId, userId: MOCK_USER.id }),
			).rejects.toThrowError(NotFoundException);
		});

		it('삭제 여부 true를 반환해야 함', () => {
			mockDogsRepository.findOne.mockResolvedValueOnce(MOCK_DOG);
			mockDogsRepository.softDelete.mockResolvedValueOnce(true);
			expect(
				dogsService.deleteOneById({ id: MOCK_DOG.id, userId: MOCK_USER.id }),
			).toBeTruthy();
		});
	});
});
