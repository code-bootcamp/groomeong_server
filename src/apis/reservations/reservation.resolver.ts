import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservation.service';

@Resolver()
export class ReservationsResolver {
	constructor(
		private readonly reservationsService: ReservationsService, //
	) {}

	// 예약ID로 예약정보 가져오기
	@Query(() => Reservation, {
		description: 'Return : 예약 정보(가게, 회원, 강아지 정보 포함)',
	})
	async fetchReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<Reservation> {
		return await this.reservationsService.findById({ reservationId });
	}

	// // 회원ID로 예약정보 가져오기
	// // 예약-회원 조인 후 주석 해제 예정
	// @Query(() => Reservation, {
	// description: 'Return : 예약 정보(가게, 회원, 강아지 정보 포함)',
	// })
	// async fetchReservationByUserId(
	// 	@Args('userId') userId: string, //
	// ): Promise<Reservation> {
	// 	return await this.reservationsService.findAllByUserId({ userId });
	// }

	//예약 삭제하기
	@Mutation(() => Boolean)
	async deleteReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<boolean> {
		return await this.reservationsService.delete({ reservationId });
	}
}
