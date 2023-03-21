import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopsService } from '../shops/shops.service';
import { UsersService } from '../users/user.service';
import { Reservation } from './entities/reservation.entity';
import {
	IReservationsServiceCreate,
	IReservationsServiceDelete,
	IReservationsServiceFindById,
	IReservationsServiceFindDeletedById,
} from './interfaces/reservations-service.interface';

@Injectable()
export class ReservationsService {
	constructor(
		@InjectRepository(Reservation)
		private readonly reservationsRepository: Repository<Reservation>, //
		private readonly usersService: UsersService,
		private readonly shopsService: ShopsService,
	) {}

	// 신규 예약 정보 생성
	async create({
		createReservationInput,
	}: IReservationsServiceCreate): Promise<Reservation> {
		const shopId = createReservationInput.shopId;
		const userId = createReservationInput.userId;
		const checkShop = this.shopsService.findById({ shopId });
		if (!checkShop) {
			throw new NotFoundException('유효하지 않은 가게ID 입니다');
		}

		// const checkUser = this.usersService.findOne({ userId });
		// if (!checkUser) {
		// 	throw new NotFoundException('유효하지 않은 회원ID 입니다');
		// }

		return await this.reservationsRepository.save({
			...createReservationInput,
		});
	}

	// 예약ID로 해당 예약정보 찾기
	async findById({
		reservationId,
	}: IReservationsServiceFindById): Promise<Reservation> {
		const result = await this.reservationsRepository.findOne({
			where: { id: reservationId },
			// relations: ['shop', 'user', 'dog'],
		});

		if (!result) {
			throw new NotFoundException(
				`예약ID가 ${reservationId}인 예약을 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// // * 가게id, 날짜, 시간을 기준으로 찾는 함수 - 확장성 고려
	// // * 다만, 현재 유저 관점의 서비스를 만들고 있으므로 이러한 함수들은 관리자 페이지에서 필요하다고 판단, 생성 생략했습니다
	// // * User테이블과 조인 후 주석 해제 예정입니다
	// async findAllByUserId({ userId }: IReservationsServiceFindAllByUserId) {
	// 	const checkUser = await this.usersRepository.findOne({
	// 		where: { user: { id: userId } },
	//    // relations: ['shop', 'user', 'dog'],
	// 	});

	// 	if (!checkUser) {
	// 		throw new NotFoundException(
	// 			`회원ID가 ${userId}인 예약을 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return await this.usersRepository.findOne({
	// 		where: { id: userId },
	// 	});
	// }

	// 삭제된 예약의 예약ID로 해당 예약 정보 가져오기
	async findDeletedById({
		reservationId,
	}: IReservationsServiceFindDeletedById): Promise<Reservation> {
		const result = await this.reservationsRepository.findOne({
			where: { id: reservationId },
			withDeleted: true,
			// relations: ['shop', 'user', 'dog'],
		});

		if (!result) {
			throw new NotFoundException(
				`예약ID가 ${reservationId}인 예약을 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// // * User테이블과 조인 후 주석 해제 예정입니다
	// async findDeletedByUserId({
	// 	userId,
	// }: IReservationsServiceFindAllByUserId): Promise<Reservation> {
	// 	const result = await this.reservationsRepository.find({
	// 		where: { user: { id: userId } },
	// 		withDeleted: true,
	// 		// relations: ['shop', 'user', 'dog'],
	// 	});

	// 	if (!result) {
	// 		throw new NotFoundException(
	// 			`회원ID가 ${userId}인 예약을 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return result;
	// }

	//예약ID로 해당 예약 정보 삭제
	async delete({
		reservationId,
	}: IReservationsServiceDelete): Promise<boolean> {
		const checkData = await this.reservationsRepository.findOne({
			where: { id: reservationId },
		});

		if (!checkData) {
			throw new NotFoundException(
				`예약ID가 ${reservationId}인 예약을 찾을 수 없습니다`,
			);
		}

		const result = await this.reservationsRepository.softDelete({
			id: reservationId,
		});

		return result.affected ? true : false;
	}
}
