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

	@Query(() => Review, {
		description: 'Return: 리뷰ID 기준으로 1개 불러오기',
	})
	fetchReview(
		@Args('reviewId') reviewId: string, //
	): Promise<Review> {
		return this.reviewsService.find({ reviewId });
	}

	@Query(() => [Review], {
		description: 'Return: 가게ID 기준으로 모든 리뷰 불러오기',
	})
	async fetchReviewsByShopId(
		@Args({ name: 'page', defaultValue: 1, nullable: true })
		page: number, //
		@Args({ name: 'count', defaultValue: 1, nullable: true })
		count: number, //
		@Args('shopId')
		shopId: string, //
	): Promise<Review[]> {
		return await this.reviewsService.findByShopIdWithPage({
			page,
			count,
			shopId,
		});
	}

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

	@Mutation(() => Boolean, {
		description: 'Return: 리뷰 삭제 후 true 반환',
	})
	deleteReview(
		@Args('reviewId') id: string, //
	): Promise<boolean> {
		return this.reviewsService.deleteOneById({ id });
	}
}
