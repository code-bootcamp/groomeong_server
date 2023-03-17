import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
		@Args('shopId') shopId: string,
		@Args('userId') userId: string,
		@Args('createReviewInput') createReviewInput: CreateReviewInput, //
	): Promise<Review> {
		return await this.reviewsService.create({
			shopId,
			userId,
			createReviewInput,
		});
	}

	// 가게의 리뷰 모아보기

	// 내가 작성한 리뷰 모아보기(회원의 리뷰 모아보기)
}
