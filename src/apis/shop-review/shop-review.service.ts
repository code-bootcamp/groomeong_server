import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewsService } from 'src/apis/reviews/reviews.service';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { ShopsService } from 'src/apis/shops/shops.service';
import { Repository } from 'typeorm';

@Injectable()
export class AddShopReviewService {
	constructor(
		private readonly shopsService: ShopsService, //
		private readonly reviewsService: ReviewsService, //
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	public async AddShopWithReviewAuth({ shopId, userId }) {
		// 예약자가 userId인 가게
		const reservationsByUser = await this.shopsRepository.find({
			where: { id: shopId, reservation: { user: { id: userId } } },
		});

		// 예약자가 userId이고, 그 예약에 리뷰 작성도 된 가게
		const reviewsByUser = await this.shopsRepository.find({
			where: { id: shopId, review: { reservation: { user: { id: userId } } } },
		});

		const hasReviewAuth = await this.reviewsService.checkReviewAuth({
			reservationsByUser,
			reviewsByUser,
		});

		const myShop = await this.shopsService.findById({ shopId });
		return { ...myShop, hasReviewAuth };
	}
}
