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
		private readonly shopsService: ShopsService,
		private readonly usersService: UsersService,
	) {}

	// 리뷰 생성하기
	async create({
		createReviewInput, //
	}: IReviewServiceCreate): Promise<Review> {
		const userId = createReviewInput.userId;
		const shopId = createReviewInput.shopId;
		// 조인 완료 후 주석 해제하기

		// const checkUser = this.usersService.findOne({ id: userId });
		// if (!checkUser) {
		// 	throw new NotFoundException('유효하지 않은 작성자입니다');
		// }

		const checkShop = this.shopsService.findById({ shopId });
		if (!checkShop) {
			throw new NotFoundException('유효하지 않은 가게입니다');
		}

		return await this.reviewsRepository.save({
			contents: createReviewInput.contents,
			star: createReviewInput.star,
			// user: {id: createReviewInput.userId},
			shop: { id: createReviewInput.shopId },
		});
	}

	async findById({ reviewId }: IReviewServiceFindById): Promise<Review> {
		const result = await this.reviewsRepository.findOne({
			where: { id: reviewId },
			relations: ['shop'],
			// relations: ['shop', 'user'],
		});

		if (!result) {
			throw new NotFoundException('아이디를 찾을 수 없습니다');
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
			throw new NotFoundException('유효하지 않은 가게ID 입니다');
		}
		const result = await this.reviewsRepository.find({
			where: { shop: { id: shopId } },
		});
		console.log(result);
		return result;
	}

	// 별점 불러오기
	async findStar({ shopId }): Promise<number> {
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
