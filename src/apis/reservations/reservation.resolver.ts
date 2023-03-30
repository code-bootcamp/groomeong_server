import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interface/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateReservationInput } from './dto/create-reservation.input';
import { returnUserWithReviewOutput } from './dto/return-reservation.output';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservation.service';

@Resolver()
export class ReservationsResolver {
	constructor(
		private readonly reservationsService: ReservationsService, //
	) {}

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

	// 예약ID로 예약정보 가져오기
	@Query(() => Reservation, {
		description: 'Return : 예약 정보',
	})
	fetchReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<Reservation> {
		return this.reservationsService.findOne({ reservationId });
	}

	// 회원의 모든 예약 가져오기
	@UseGuards(GqlAuthGuard('access'))
	@Query(() => [Reservation], {
		description: 'Return : 한 회원의 예약 정보',
	})
	fetchReservationsByUser(
		@Context() context: IContext, //
	): Promise<Reservation[]> {
		const userId = context.req.user.id;
		console.log(userId, '@@@@');
		return this.reservationsService.findAllByUserId({ userId });
	}

	// 가게의 모든 예약 가져오기
	@Query(() => [Reservation], {
		description: 'Return : 한 가게의 예약 정보',
	})
	fetchReservationsByShop(
		@Args('shopId') shopId: string, //
	): Promise<Reservation[]> {
		return this.reservationsService.findAllByShopId({ shopId });
	}

	// 가게의 모든 예약과 예약자 가져오기
	@Query(() => [returnUserWithReviewOutput], {
		description:
			'Return : { profile: 회원정보 , review: 그 회원이 작성한 리뷰 } 형식의 객체들이 모인 배열',
	})
	fetchForShopDetailPage(
		@Args('shopId') shopId: string, //
	): Promise<returnUserWithReviewOutput[]> {
		return this.reservationsService.findForShopDetailPage({ shopId });
	}

	//예약 삭제하기
	@Mutation(() => Boolean, { description: ' Return: 예약 삭제하기' })
	deleteReservation(
		@Args('reservationId') reservationId: string, //
	): Promise<boolean> {
		return this.reservationsService.delete({ reservationId });
	}
}
