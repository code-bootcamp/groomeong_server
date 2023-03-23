import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/user.service';
import { ShopsService } from '../shops/shops.service';
import { Review } from './entities/review.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import {
	IReviewServiceCreate,
	IReviewServiceFindById,
	IReviewServiceFindByShopId,
	IReviewServiceFindByUserId,
} from './interfaces/reviews-service.interface';

@Injectable()
export class ReviewsService {
	constructor(
		@InjectRepository(Review)
		private readonly reviewsRepository: Repository<Review>, //

		@InjectRepository(Reservation)
		private readonly reservationsRepository: Repository<Reservation>,

		private readonly shopsService: ShopsService,
	) {}

	// 리뷰 생성하기
	async create({
		userId,
		createReviewInput, //
	}: IReviewServiceCreate): Promise<Review> {
		const shopId = createReviewInput.shopId;
		// 브라우저에서 보내준 shopId, userId가 DB의 예약에 등록된게 있는지 확인
		const myReservations = await this.reservationsRepository.find({
			where: { user: { id: userId }, shop: { id: shopId } },
		});

		console.log('🟪🟪🟪', myReservations);
		if (myReservations.length === 0) {
			throw new UnprocessableEntityException(
				'해당 가게에 예약한 내역이 없습니다',
			);
		}

		// 정보가 일치하는 예약들 중, 리뷰 작성되지 않은 것이 있다면 리뷰저장 가능
		const hasReview = [];
		await myReservations.filter((el) => {
			this.reviewsRepository.find({
				where: { reservation: { id: el.id } },
			});
		});
		if (hasReview.length !== 0) {
			throw new UnprocessableEntityException(
				'모든 예약 건에 리뷰를 작성하셨습니다',
			);
		}

		// 리뷰 저장하기
		const result = await this.reviewsRepository.save({
			contents: createReviewInput.contents,
			star: createReviewInput.star,
			reservation: { id: createReviewInput.reservationId },
			shop: { id: createReviewInput.shopId },
		});

		// 별점평균 계산하기
		const _averageStar = await this.averageStar({ shopId });
		console.log('🟨🟨🟨', _averageStar);

		// shop 테이블에 별점평균 넣어서 저장하기
		const noReturn = this.shopsService.update({
			shopId: shopId, //
			updateShopInput: { averageStar: Number(_averageStar) },
		});

		// 저장한 리뷰 리턴하기
		return result;
	}

	async findById({ reviewId }: IReviewServiceFindById): Promise<Review> {
		const result = await this.reviewsRepository.findOne({
			where: { id: reviewId },
			relations: ['shop', 'reservation'],
		});

		if (!result) {
			throw new UnprocessableEntityException('아이디를 찾을 수 없습니다');
		}

		return result;
	}

	// // 조인 완료 후 주석 해제 예정
	// // 내가 작성한 리뷰 모아보기(회원의 리뷰 모아보기)
	// async findByUserId({ userId }: IReviewServiceFindByUserId): Promise<Review> {
	// 	const checkUser = this.usersService.findOne({ userId });
	// 	if (!checkUser) {
	// 		throw new NotFoundException('유효하지 않은 회원ID 입니다');
	// 	}

	// 	return await this.reviewsRepository.find({
	// 		where: { user: { id: userId } },
	// 	});
	// }

	// 가게의 리뷰 모아보기
	async findByShopId({
		shopId, //
	}: IReviewServiceFindByShopId): Promise<Review[]> {
		const checkShop = await this.shopsService.findById({ shopId });
		if (!checkShop) {
			throw new UnprocessableEntityException('유효하지 않은 가게ID 입니다');
		}
		const result = await this.reviewsRepository.find({
			where: { shop: { id: shopId } },
			order: {
				createAt: 'ASC',
			},
		});
		console.log(result);
		return result;
	}

	// 별점평균 계산하기
	async averageStar({ shopId }): Promise<number> {
		const reviews = await this.reviewsRepository.find({
			where: { shop: { id: shopId } },
		});
		let sum = 0;
		reviews.forEach((el) => {
			sum += Number(el.star);
		});

		const result = (sum / reviews.length).toFixed(1);

		return Number(result);
	}
}
