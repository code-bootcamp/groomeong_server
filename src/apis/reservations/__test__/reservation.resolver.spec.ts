import {
	ConflictException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DogsService } from 'src/apis/dogs/dogs.service';
import { MOCK_DOG, MOCK_USER } from 'src/apis/dogs/__test__/dogs.mocking';
import { ShopsService } from 'src/apis/shops/shops.service';
import { UsersService } from 'src/apis/users/user.service';
import { CreateReservationInput } from '../dto/create-reservation.input';
import { Reservation } from '../entities/reservation.entity';
import { ReservationsResolver } from '../reservations.resolver';
import { ReservationsService } from '../reservations.service';
import {
	MOCK_RESERVATION,
	MOCK_REVIEW,
	MOCK_SHOP,
} from './reservation.mocking';
import * as httpMocks from 'node-mocks-http';
import { IContext } from 'src/commons/interface/context';
import { User } from 'src/apis/users/entities/user.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';

describe('ReservationsResolver', () => {
	let reservationsResolver: ReservationsResolver;

	const mockReservationsService = {
		create: jest.fn(),
		checkDuplication: jest.fn(),
		findOne: jest.fn(),
		findAllByUserId: jest.fn(),
		findAllByShopId: jest.fn(),
		delete: jest.fn(),
	};

	const mockReservationsRepository = {
		save: jest.fn(),
		findOne: jest.fn(),
		find: jest.fn(),
		softDelete: jest.fn(),
	};

	const mockShopsService = {
		findById: jest.fn(),
	};

	const mockUsersService = {
		findOne: jest.fn(),
	};

	const mockDogsService = {
		findOneById: jest.fn(),
	};

	const mockReviewRepository = {
		find: jest.fn(),
	};

	beforeEach(async () => {
		const reservationsModule = await Test.createTestingModule({
			providers: [
				ReservationsResolver,
				{
					provide: ReservationsService,
					useValue: mockReservationsService,
				},
				{
					provide: getRepositoryToken(Reservation),
					useValue: mockReservationsRepository,
				},
				{
					provide: ShopsService,
					useValue: mockShopsService,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: DogsService,
					useValue: mockDogsService,
				},
				{
					provide: getRepositoryToken(Review),
					useValue: mockReviewRepository,
				},
			],
		}).compile();

		reservationsResolver =
			reservationsModule.get<ReservationsResolver>(ReservationsResolver);
	});

	it('reservationsResolver가 정의되어야 함', () => {
		expect(reservationsResolver).toBeDefined();
	});

	describe('createReservation', () => {
		const createReservationInput: CreateReservationInput = {
			date: MOCK_RESERVATION.date,
			time: MOCK_RESERVATION.time,
			shopId: MOCK_RESERVATION.shop.id,
			userId: MOCK_RESERVATION.user.id,
			dogId: MOCK_RESERVATION.dog.id,
		};

		it('예약 시간이 중복된 경우 ConflictException을 던져야 함', () => {
			mockReservationsService.checkDuplication.mockImplementation(
				(date: Date, time: string, shopId: string) => MOCK_RESERVATION,
			);

			try {
				reservationsResolver.createReservation(createReservationInput);
			} catch (error) {
				expect(error).toBeInstanceOf(ConflictException);
				expect(error.message).toBe('이미 예약된 시간입니다');
			}
		});

		it('유효하지 않은 shopId인 경우 UnprocessableEntityException를 던져야 함', () => {
			mockReservationsService.checkDuplication.mockImplementation(
				(date: Date, time: string, shopId: string) => null,
			);
			mockShopsService.findById.mockImplementation((shopId: string) => null);

			try {
				reservationsResolver.createReservation(createReservationInput);
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toBe('유효하지 않은 가게ID 입니다');
			}
		});

		it('유효하지 않은 userId인 경우 UnprocessableEntityException를 던져야 함', () => {
			mockReservationsService.checkDuplication.mockImplementation(
				(date: Date, time: string, shopId: string) => null,
			);
			mockShopsService.findById.mockImplementation(
				(shopId: string) => MOCK_SHOP,
			);
			mockUsersService.findOne.mockImplementation((userId: string) => null);

			try {
				reservationsResolver.createReservation(createReservationInput);
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toBe('유효하지 않은 회원ID 입니다');
			}
		});

		it('강아지 정보를 찾을 수 없는 경우 NotFoundException을 던져야 함', () => {
			mockReservationsService.checkDuplication.mockImplementation(
				(date: Date, time: string, shopId: string) => null,
			);
			mockShopsService.findById.mockImplementation(
				(shopId: string) => MOCK_SHOP,
			);
			mockUsersService.findOne.mockImplementation(
				(userId: string) => MOCK_USER,
			);
			mockDogsService.findOneById.mockImplementation((dogId: string) => {
				throw new NotFoundException(`id ${dogId}를 갖는 강아지를 찾을 수 없음`);
			});

			try {
				reservationsResolver.createReservation(createReservationInput);
			} catch (error) {
				expect(error).toBeInstanceOf(NotFoundException);
				expect(error.message).toBe(
					`id ${createReservationInput.dogId}를 갖는 강아지를 찾을 수 없음`,
				);
			}
		});

		it('생성한 예약 정보를 리턴해야 함', async () => {
			mockReservationsService.checkDuplication.mockImplementation(
				(date: Date, time: string, shopId: string) => null,
			);
			mockShopsService.findById.mockImplementation(
				(shopId: string) => MOCK_SHOP,
			);
			mockUsersService.findOne.mockImplementation(
				(userId: string) => MOCK_USER,
			);
			mockDogsService.findOneById.mockImplementation(
				(dogId: string) => MOCK_DOG,
			);
			mockReservationsRepository.save.mockImplementation(
				(
					date: Date,
					time: string,
					shop: { id: string },
					user: { id: string },
					dog: { id: string },
				) => MOCK_RESERVATION,
			);
			mockReservationsRepository.findOne.mockImplementation(
				(where: { id: string }) => MOCK_RESERVATION,
			);
			mockReservationsService.create.mockImplementation(
				(createReservationInput: CreateReservationInput) => MOCK_RESERVATION,
			);

			const result = await reservationsResolver.createReservation(
				createReservationInput,
			);
			expect(result).toEqual(MOCK_RESERVATION);
		});
	});

	describe('fetchReservation', () => {
		it('예약을 찾을 수 없는 경우 UnprocessableEntityException를 던져야 함', () => {
			mockReservationsRepository.findOne.mockImplementation(
				(where: { id: string }) => null,
			);
			const invalidReservationId = '6b7a693d-f0db-4e98-bddd-d855f5324ecf';

			try {
				reservationsResolver.fetchReservation(invalidReservationId);
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toBe('예약을 찾을 수 없습니다');
			}
		});

		it('예약 정보를 리턴해야 함', async () => {
			mockReservationsRepository.findOne.mockImplementation(
				(where: { id: string }) => MOCK_RESERVATION,
			);
			mockReservationsService.findOne.mockImplementation(
				(reservationId: string) => MOCK_RESERVATION,
			);

			const result = await reservationsResolver.fetchReservation(
				MOCK_RESERVATION.id,
			);
			expect(result).toEqual(MOCK_RESERVATION);
		});
	});

	describe('fetchReservationsByUser', () => {
		const context: IContext = {
			req: httpMocks.createRequest(),
			res: httpMocks.createResponse(),
		};
		context.req.user = new User();

		it('회원을 찾을 수 없는 경우 UnprocessableEntityException를 던져야 함', () => {
			mockReservationsRepository.find.mockImplementation(
				(where: { user: { id: string } }) => null,
			);
			const invalidUserId = 'c84fa63e-7a05-4cd5-b015-d4db9a262b20';
			context.req.user.id = invalidUserId;

			try {
				reservationsResolver.fetchReservationsByUser(context);
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toBe(
					`회원ID가 ${invalidUserId}인 예약을 찾을 수 없습니다`,
				);
			}
		});

		it('회원의 모든 예약 정보를 배열로 리턴해야 함', async () => {
			mockReservationsRepository.find.mockImplementation(
				(where: { user: { id: string } }) => [MOCK_RESERVATION],
			);
			mockReservationsService.findAllByUserId.mockImplementation(
				(context: IContext) => [MOCK_RESERVATION],
			);

			const result = await reservationsResolver.fetchReservationsByUser(
				context,
			);
			expect(result).toEqual([MOCK_RESERVATION]);
		});
	});

	describe('fetchReservationsByShop', () => {
		it('가게를 찾을 수 없는 경우 UnprocessableEntityException를 던져야 함', () => {
			mockReservationsRepository.find.mockImplementation(
				(where: { shop: { id: string } }) => null,
			);
			const invalidShopId = '89a3c0c1-60db-4725-8e65-b33a95acb805';

			try {
				reservationsResolver.fetchReservationsByShop(invalidShopId);
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toBe(
					`가게가 ${invalidShopId}인 예약을 찾을 수 없습니다`,
				);
			}
		});

		it('가게의 모든 예약 정보를 배열로 리턴해야 함', async () => {
			mockReservationsRepository.find.mockImplementation(
				(where: { shop: { id: string } }) => [MOCK_RESERVATION],
			);
			mockReservationsService.findAllByShopId.mockImplementation(
				(shopId: string) => [MOCK_RESERVATION],
			);

			const result = await reservationsResolver.fetchReservationsByShop(
				MOCK_RESERVATION.shop.id,
			);
			expect(result).toEqual([MOCK_RESERVATION]);
		});
	});

	// describe('findForShopDetailPage', () => {
	// 	it('가게의 모든 리뷰 작성자 프로필과 리뷰를 배열로 리턴해야 함', () => {
	// 		mockReservationsRepository.find.mockImplementation(
	// 			(where: { shop: { id: string } }) => [MOCK_RESERVATION],
	// 		);
	// 		mockReservationsRepository.find.mockImplementation(
	// 			(
	// 				where: { shop: { id: string } }, //
	// 				reservation: { id: string },
	// 			) => [MOCK_REVIEW],
	// 		);
	// 	});
	// });

	describe('deleteReservation', () => {
		it('예약을 찾을 수 없는 경우 UnprocessableEntityException를 던져야 함', () => {
			mockReservationsRepository.findOne.mockImplementation(
				(where: { id: string }) => null,
			);
			const invalidReservationId = '6b7a693d-f0db-4e98-bddd-d855f5324ecf';

			try {
				reservationsResolver.deleteReservation(invalidReservationId);
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
				expect(error.message).toBe(
					`예약ID가 ${invalidReservationId}인 예약을 찾을 수 없습니다`,
				);
			}
		});

		it('삭제 여부를 true로 반환해야 함', async () => {
			mockReservationsRepository.findOne.mockImplementation(
				(where: { id: string }) => MOCK_RESERVATION,
			);
			mockReservationsRepository.softDelete.mockImplementation(
				(id: string) => 1,
			);
			mockReservationsService.delete.mockImplementation(
				(reservationId: string) => true,
			);

			const result = await reservationsResolver.deleteReservation(
				MOCK_RESERVATION.id,
			);
			expect(result).toBe(true);
		});
	});
});
