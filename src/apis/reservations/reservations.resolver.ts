import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interface/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateReservationInput } from './dto/create-reservation.input';
import { returnUserWithReviewOutput } from './dto/return-reservation.output';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

@Resolver()
export class ReservationsResolver {
	constructor(
		private readonly reservationsService: ReservationsService, //
	) {}

	@Query(
		() => Reservation, //
		{ description: 'Return : 예약 정보' },
	)
	fetchReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<Reservation> {
		return this.reservationsService.findOne({ reservationId });
	}

	@UseGuards(GqlAuthGuard('access'))
	@Query(
		() => [Reservation], //
		{ description: 'Return : 한 회원의 모든 예약 정보' },
	)
	fetchReservationsByUser(
		@Context() context: IContext, //
	): Promise<Reservation[]> {
		const userId = context.req.user.id;
		return this.reservationsService.findAllByUserId({ userId });
	}

	@Query(
		() => [Reservation], //
		{ description: 'Return : 한 가게의 예약 정보' },
	)
	fetchReservationsByShop(
		@Args('shopId') shopId: string, //
	): Promise<Reservation[]> {
		return this.reservationsService.findAllByShopId({ shopId });
	}

	@Query(
		() => [returnUserWithReviewOutput], //
		{
			description:
				'Return : { profile: 회원정보 , review: 그 회원이 작성한 리뷰 } 형식의 배열',
		},
	)
	fetchForShopDetailPage(
		@Args('shopId') shopId: string, //
	): Promise<returnUserWithReviewOutput[]> {
		return this.reservationsService.findForShopDetailPage({ shopId });
	}

	@Mutation(
		() => Reservation, //
		{ description: 'Return: 생성된 신규 예약 정보' },
	)
	async createReservation(
		@Args('createReservationInput')
		createReservationInput: CreateReservationInput, //
	): Promise<Reservation> {
		return await this.reservationsService.create({
			createReservationInput,
		});
	}

	@Mutation(
		() => Boolean, //
		{ description: ' Return: 예약 삭제하기' },
	)
	deleteReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<boolean> {
		return this.reservationsService.delete({ reservationId });
	}
}
