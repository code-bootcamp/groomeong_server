import {
	ConflictException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DogsService } from '../dogs/dogs.service';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { ShopsService } from '../shops/shops.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { returnUserWithReviewOutput } from './dto/return-reservation.output';
import { Reservation } from './entities/reservation.entity';
import {
	IReservationsServiceCheckDuplication,
	IReservationsServiceCreate,
	IReservationsServiceDelete,
	IReservationsServiceFindAllByShopId,
	IReservationsServiceFindAllByUserId,
	IReservationsServiceFindById,
	IReservationsServiceFindDeletedById,
	IReservationsServiceFindForShopDetailPage,
} from './interfaces/reservations-service.interface';

@Injectable()
export class ReservationsService {
	constructor(
		@InjectRepository(Reservation)
		private readonly reservationsRepository: Repository<Reservation>, //
		private readonly usersService: UsersService,
		private readonly shopsService: ShopsService,
		private readonly dogsService: DogsService,
		@InjectRepository(Review)
		private readonly reviewsRepository: Repository<Review>,
	) {}

	// 신규 예약 정보 생성
	async create({
		createReservationInput,
	}: IReservationsServiceCreate): Promise<Reservation> {
		const { date, time, shopId, userId, dogId } = createReservationInput;

		const checkReservation = await this.checkDuplication({
			date,
			time,
			shopId,
		});
		if (checkReservation) {
			throw new ConflictException('이미 예약된 시간입니다');
		}

		const checkShop = await this.shopsService.findById({ shopId });
		if (!checkShop) {
			throw new UnprocessableEntityException('유효하지 않은 가게ID 입니다');
		}

		const checkUser = await this.usersService.findOne({ userId });
		if (!checkUser) {
			throw new UnprocessableEntityException('유효하지 않은 회원ID 입니다');
		}

		await this.dogsService.findOneById({ id: dogId });

		const result = await this.reservationsRepository.save({
			...createReservationInput,
			shop: {
				id: shopId,
			},
			user: {
				id: userId,
			},
			dog: {
				id: dogId,
			},
		});

		return this.reservationsRepository.findOne({
			where: { id: result.id },
			relations: ['dog', 'shop', 'user'],
		});
	}

	// 예약 가능 여부 확인하기
	async checkDuplication({
		date,
		time,
		shopId,
	}: IReservationsServiceCheckDuplication): Promise<Reservation> {
		const checkReservation = await this.reservationsRepository.findOneBy({
			date,
			time,
			shop: {
				id: shopId,
			},
		});
		return checkReservation;
	}

	// 예약ID로 해당 예약정보 찾기
	async findOne({
		reservationId,
	}: IReservationsServiceFindById): Promise<Reservation> {
		const result = await this.reservationsRepository.findOne({
			where: { id: reservationId },
			relations: ['shop', 'user', 'dog'],
			order: {
				date: 'ASC',
				time: 'ASC',
			},
		});

		if (!result) {
			throw new UnprocessableEntityException('예약을 찾을 수 없습니다');
		}

		return result;
	}

	// 회원의 모든 예약 가져오기
	async findAllByUserId({
		userId,
	}: IReservationsServiceFindAllByUserId): Promise<Reservation[]> {
		const result = await this.reservationsRepository.find({
			where: { user: { id: userId } },
			relations: ['shop', 'user', 'dog', 'review'],
			order: {
				date: 'ASC',
				time: 'ASC',
			},
		});

		if (!result) {
			throw new UnprocessableEntityException(
				`회원ID가 ${userId}인 예약을 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// 가게의 모든 예약 가져오기
	async findAllByShopId({
		shopId,
	}: IReservationsServiceFindAllByShopId): Promise<Reservation[]> {
		const result = await this.reservationsRepository.find({
			where: { shop: { id: shopId } },
			relations: ['shop', 'user', 'dog'],
			order: {
				date: 'ASC',
				time: 'ASC',
			},
		});

		if (!result) {
			throw new UnprocessableEntityException(
				`가게ID가 ${shopId}인 예약을 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// 가게 상세페이지용 : 가게의 모든 리뷰작성자 프로필과 리뷰 가져오기
	async findForShopDetailPage({
		shopId,
	}: IReservationsServiceFindForShopDetailPage): Promise<
		returnUserWithReviewOutput[]
	> {
		// 해당 가게의 예약들
		const myBooks = await this.reservationsRepository.find({
			where: { shop: { id: shopId } },
			relations: ['shop', 'user'],
		});
		// 예약과 연결된 유저ID들
		const userIds = [];
		const userIds1 = myBooks.forEach((el) => {
			if (!userIds.includes(el.user.id)) {
				userIds.push(el.user.id);
			}
		});

		// 예약의 리뷰들
		const myReviews: Review[] = [];
		for (let i = 0; i < myBooks.length; i++) {
			const reviews = await this.reviewsRepository.find({
				where: { shop: { id: shopId }, reservation: { id: myBooks[i].id } },
				relations: ['shop', 'reservation'],
			});
			if (reviews[0] !== undefined) {
				myReviews.push(reviews[0]);
			}
		}

		const fetchList: returnUserWithReviewOutput[] = [];
		// 유저-리뷰 매핑 // 가독성을 위해 우선 for문 사용
		for (let i = 0; i < userIds.length; i++) {
			for (let j = 0; j < myReviews.length; j++) {
				const resultBook = await this.reservationsRepository.find({
					where: {
						shop: { id: shopId },
						user: { id: userIds[i] },
					},
					relations: ['user'],
				});
				const _user = resultBook[0].user;
				const _review = myReviews[j];
				if (resultBook[0].id === myReviews[0].reservation.id)
					fetchList.push({ profile: _user, review: _review });
			}
		}

		return fetchList;
	}

	//예약 삭제하기
	async delete({
		reservationId,
	}: IReservationsServiceDelete): Promise<boolean> {
		const checkData = await this.reservationsRepository.findOne({
			where: { id: reservationId },
		});

		if (!checkData) {
			throw new UnprocessableEntityException(
				`예약ID가 ${reservationId}인 예약을 찾을 수 없습니다`,
			);
		}

		const result = await this.reservationsRepository.softDelete({
			id: reservationId,
		});

		return result.affected ? true : false;
	}

	// // <--- 기능 필요하다면 주석 해제 --->
	// // 삭제된 예약 정보 가져오기
	// async findDeletedById({
	// 	reservationId,
	// }: IReservationsServiceFindDeletedById): Promise<Reservation> {
	// 	const result = await this.reservationsRepository.findOne({
	// 		where: { id: reservationId },
	// 		withDeleted: true,
	// 		// relations: ['shop', 'user', 'dog'],
	// 	});

	// 	if (!result) {
	// 		throw new UnprocessableEntityException(
	// 			`예약ID가 ${reservationId}인 예약을 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return result;
	// }

	// // 유저의 삭제된 예약 정보 가져오기
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
}
