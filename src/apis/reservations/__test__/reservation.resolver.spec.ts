import {
	ConflictException,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DogsService } from 'src/apis/dogs/dogs.service';
import { ShopsService } from 'src/apis/shops/shops.service';
import { UsersService } from 'src/apis/users/user.service';
import { CreateReservationInput } from '../dto/create-reservation.input';
import { ReservationsResolver } from '../reservation.resolver';
import { ReservationsService } from '../reservation.service';
import { MOCK_RESERVATION, MOCK_SHOP } from './reservation.mocking';

describe('ReservationsResolver', () => {
	let reservationsResolver: ReservationsResolver;

	const mockReservationsService = {
		create: jest.fn(),
		checkDuplication: jest.fn(),
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

	beforeEach(async () => {
		const reservationsModule = await Test.createTestingModule({
			providers: [
				ReservationsResolver,
				{
					provide: ReservationsService,
					useValue: mockReservationsService,
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
	});
});
