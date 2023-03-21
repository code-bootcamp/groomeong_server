import { Args, Mutation, Resolver, Query, Float } from '@nestjs/graphql';
import { CreateReviewInput } from './dto/create-review.input';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
	constructor(
		private readonly reviewsService: ReviewsService, //
	) {}

	//리뷰 생성하기
	@Mutation(() => Review, {
		description: 'Return: 신규 생성된 리뷰 데이터',
	})
	async createReview(
		@Args('createReviewInput') createReviewInput: CreateReviewInput, //
	): Promise<Review> {
		return await this.reviewsService.create({
			createReviewInput,
		});
	}

	// 리뷰 1개 불러오기
	@Query(() => Review, {
		description: 'Return: 리뷰ID 기준으로 1개 불러오기',
	})
	async fetchReview(
		@Args('reviewId') reviewId: string, //
	): Promise<Review> {
		return await this.reviewsService.findById({ reviewId });
	}

	// 가게의 리뷰 모아보기
	@Query(() => [Review], {
		description: 'Return: 가게ID 기준으로 모든 리뷰 불러오기',
	})
	async fetchReviewsByShopId(
		@Args('shopId') shopId: string, //
	): Promise<Review[]> {
		return await this.reviewsService.findByShopId({ shopId });
	}

	// // 회원의 리뷰 모아보기
	// @Query(() => Review, {
	// 	description: 'Return: 회원ID 기준으로 모든 리뷰 불러오기',
	// })
	// async fetchReviewsByUserId(
	// 	@Args('userId') userId: string, //
	// ): Promise<[Review]> {
	// 	//
	// }

	// 별점 평균값 구하기
	@Query(() => Float, {
		description: 'Return : 가게의 별점 (평균값, 소수점 숫자)',
	})
	async fetchAverageStar(
		@Args('shopId') shopId: string, //
	): Promise<number> {
		return this.reviewsService.findStar({ shopId });
	}
}
