import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopsService } from '../shops/shops.service';
import { Review } from './entities/review.entity';
import {
	IReviewServiceCreate,
	IReviewServiceFindById,
	IReviewServiceFindByShopId,
} from './interfaces/reviews-service.interface';

@Injectable()
export class ReviewsService {
	constructor(
		@InjectRepository(Review)
		private readonly reviewsRepository: Repository<Review>, //

		private readonly shopsService: ShopsService,
	) {}

	// 리뷰 가져오기
	async find({ reviewId }: IReviewServiceFindById): Promise<Review> {
		const result = await this.reviewsRepository.findOne({
			where: { id: reviewId },
			relations: ['shop', 'reservation'],
		});

		if (!result) {
			throw new UnprocessableEntityException('아이디를 찾을 수 없습니다');
		}

		return result;
	}

	// 가게의 모든 리뷰 가져오기
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

	// 리뷰 생성하기
	async create({
		userId,
		createReviewInput, //
	}: IReviewServiceCreate): Promise<Review> {
		const shopId = createReviewInput.shopId;

		// //리뷰 작성 권한 체크하기
		// // -> 브라우저에서 유저의 권한 여부에 따라 다른 페이지를 보여준다면, create 시 권한 체크는 불필요하지 않은지?
		// this.checkReviewAuth({ shopId, userId, reservationCountByUser });

		// 리뷰 저장하기
		const result = await this.reviewsRepository.save({
			contents: createReviewInput.contents,
			star: createReviewInput.star,
			reservation: { id: createReviewInput.reservationId },
			shop: { id: createReviewInput.shopId },
		});

		// 가게의 별점평균 업데이트 하기
		const _averageStar = await this.averageStar({ shopId });
		this.shopsService.update({
			shopId: shopId, //
			updateShopInput: { averageStar: Number(_averageStar) },
		});

		// 저장한 리뷰 리턴하기
		return result;
	}

	// 가게의 별점평균 계산하기
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

	//리뷰 작성 권한 체크하기(fetchShop 시)
	// (--> /shop-review.resolver/fetchShopWithReviewAuth)
	async checkReviewAuth({
		reservationsByUser,
		reviewsByUser,
	}): Promise<boolean> {
		// // 이 가게가 가진 리뷰(리뷰 ⊃ 가게)
		// const reviewsOnShop = await this.reviewsRepository.find({
		// 	where: { shop: { id: shopId } },
		// });
		// console.log('🟩🟩 shopId 🟩🟩', shopId);
		// console.log('🟩🟩 ByShop 🟩🟩', reviewsOnShop);

		// // 이 유저가 작성한 리뷰(리뷰 ⊃ 회원)
		// const reviewsByUser = await this.reviewsRepository.find({
		// 	where: { reservation: { user: { id: userId } } },
		// });
		// console.log('🟨🟨 userId 🟨🟨', userId);
		// console.log('🟨🟨 ByUser 🟨🟨', reviewsByUser);

		// // 회원이 이 가게에 작성한 리뷰
		// // [ 가게가 가진 리뷰 ∩ 유저가 작성한 리뷰 ] 인 경우만 모으기
		// const reviewsOnShopByUser = reviewsOnShop.flatMap((el) => {
		// 	return reviewsByUser.filter((ele) => ele.id === el.id);
		// });

		// console.log('🟪🟪 reviewsOnShopByUser 🟪🟪', reviewsByUser);
		// if (reviewsByUser.length === 0) {
		// 	throw new UnprocessableEntityException(
		// 		'해당 가게에 대해 작성한 리뷰가 없습니다',
		// 	);
		// }

		// [ 회원이 이 가게에 작성한 리뷰 수 === 회원이 이 가게에 한 예약 수 ] 라면 작성 권한 없음
		// console.log('🟥🟥 reservationsByUser 🟥🟥', reservationsByUser);

		if (reservationsByUser.length === 0) {
			throw new UnprocessableEntityException(
				'리뷰 작성 불가 : 이 회원은 예약서비스를 이용한 기록이 0건 입니다',
			);
		}

		if (reviewsByUser.length === reservationsByUser.length) {
			throw new UnprocessableEntityException(
				'리뷰 작성 불가 : 이 회원은 모든 예약 건에 리뷰를 작성한 상태입니다',
			);
		}

		return true;
	}
}
