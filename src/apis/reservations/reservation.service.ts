import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import {
	IReservationsServiceCreate,
	IReservationsServiceDelete,
	IReservationsServiceFindAllByUserId,
	IReservationsServiceFindById,
	IReservationsServiceFindDeletedById,
} from './interfaces/reservation-service.interface';

@Injectable()
export class ReservationsService {
	constructor(
		@InjectRepository(Reservation)
		private readonly reservationsRepository: Repository<Reservation>, //
		private readonly usersRepository: Repository<User>,
	) {}

	async create({
		createReservationInput,
	}: IReservationsServiceCreate): Promise<Reservation> {
		return await this.reservationsRepository.save({
			...createReservationInput,
		});
	}

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
	// 		where: { id: userId },
	//    // relations: ['shop', 'user', 'dog'],
	// 	});

	// 	if (!checkUser) {
	// 		throw new NotFoundException(
	// 			`회원ID가 ${userId}인 예약을 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return await this.usersRepository.findOne({
	// 		where: { userId: userId },
	// 	});
	// }

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
	// 		where: { userId: userId },
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
