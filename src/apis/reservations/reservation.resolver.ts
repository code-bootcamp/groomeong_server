import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interface/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateReservationInput } from './dto/create-reservation.input';
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
	@UseGuards(GqlAuthGuard('access'))
	@Query(() => [Reservation], {
		description: 'Return : 예약 정보(가게, 회원, 강아지 정보 포함)',
	})
	fetchReservationsByUserId(
		@Context() context: IContext, //
	): Promise<Reservation[]> {
		const userId = context.req.user.id;
		console.log(userId, '@@@@');
		return this.reservationsService.findAllByUserId({ userId });
	}

	//예약 생성하기
	@Mutation(() => Reservation, { description: 'Return: 생성된 신규 예약 정보' })
	async createReservation(
		@Args('createReservationInput')
		createReservationInput: CreateReservationInput, //
	): Promise<Reservation> {
		return await this.reservationsService.create({
			createReservationInput,
		});
	}

	//예약 생성하기
	@Mutation(() => Boolean, { description: ' Return: 예약 삭제하기' })
	deleteReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<boolean> {
		return this.reservationsService.delete({ reservationId });
	}
}
