import { UseGuards } from '@nestjs/common';
import {
	Args,
	Mutation,
	Resolver,
	Query,
	Float,
	Context,
} from '@nestjs/graphql';
import { IContext } from 'src/commons/interface/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CreateReviewInput } from './dto/create-review.input';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver()
export class ReviewsResolver {
	constructor(
		private readonly reviewsService: ReviewsService, //
	) {}

	//리뷰 생성하기 (조건: 로그인 한 유저여야 함. 예약ID가 일치해야함)
	@UseGuards(GqlAuthGuard('access'))
	@Mutation(() => Review, {
		description:
			'Return: 신규 생성된 리뷰 데이터(로그인 한 유저만 생성 가능. 로그인 시 발행된 accessToken을 Header에 입력해야함)',
	})
	async createReview(
		@Args('createReviewInput') createReviewInput: CreateReviewInput, //
		@Context() context: IContext,
	): Promise<Review> {
		const _userId = context.req.user.id;
		return await this.reviewsService.create({
			userId: _userId,
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
		@Args({ name: 'page', defaultValue: 1, nullable: true })
		page: number, //
		@Args('shopId') shopId: string, //
	): Promise<Review[]> {
		return await this.reviewsService.findByShopId({ page, shopId });
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
}
