import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
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

	//리뷰 생성하기 (로그인 한 유저)
	@UseGuards(GqlAuthGuard('access'))
	@Mutation(() => Review, {
		description: 'Return: 신규 생성된 리뷰 데이터',
	})
	createReview(
		@Args('createReviewInput') createReviewInput: CreateReviewInput, //
		@Context() context: IContext,
	): Promise<Review> {
		const _userId = context.req.user.id;
		return this.reviewsService.create({
			userId: _userId,
			createReviewInput,
		});
	}

	// 리뷰 가져오기
	@Query(() => Review, {
		description: 'Return: 리뷰ID 기준으로 1개 불러오기',
	})
	fetchReview(
		@Args('reviewId') reviewId: string, //
	): Promise<Review> {
		return this.reviewsService.find({ reviewId });
	}

	// 가게의 모든 리뷰 가져오기
	@Query(() => [Review], {
		description: 'Return: 가게ID 기준으로 모든 리뷰 불러오기',
	})
	async fetchReviewsByShop(
		@Args('shopId') shopId: string, //
	): Promise<Review[]> {
		return await this.reviewsService.findByShopId({ shopId });
	}
}
