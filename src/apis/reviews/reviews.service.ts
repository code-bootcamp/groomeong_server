import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/user.service';
import { ShopsService } from '../shops/shops.service';
import { Review } from './entities/review.entity';
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
		private readonly usersService: UsersService,
		private readonly shopsService: ShopsService,
	) {}

	// 리뷰 생성하기
	async create({
		userId,
		shopId,
		createReviewInput,
	}: IReviewServiceCreate): Promise<Review> {
		// 조인 완료 후 주석 해제하기

		// const checkUser = this.usersService.findOne({ userId });
		// if (!checkUser) {
		// 	throw new NotFoundException('유효하지 않은 작성자입니다');
		// }

		// const checkShop = this.shopsService.findById({ shopId });
		// if (!checkShop) {
		// 	throw new NotFoundException('유효하지 않은 가게입니다');
		// }

		return await this.reviewsRepository.save({
			shop: shopId,
			user: userId,
			...createReviewInput,
		});
	}

	async findById({ reviewId }: IReviewServiceFindById): Promise<Review> {
		return await this.reviewsRepository.findOne({
			where: { id: reviewId },
		});
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

	// // 가게의 리뷰 모아보기
	// async findByShopId({ shopId }: IReviewServiceFindByShopId): Promise<Review> {
	// 	const checkShop = this.shopsService.findById({ shopId });
	// 	if (!checkShop) {
	// 		throw new NotFoundException('유효하지 않은 가게ID 입니다');
	// 	}
	// 	return;
	// }
}
