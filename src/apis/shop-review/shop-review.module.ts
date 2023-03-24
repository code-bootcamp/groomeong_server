import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { ReviewsService } from 'src/apis/reviews/reviews.service';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { ShopsService } from 'src/apis/shops/shops.service';
import { AddShopReviewService } from 'src/apis/shop-review/shop-review.service';
import { AddShopReviewResolver } from './shop-review.resolver';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
			Review,
		]),
	],
	providers: [
		AddShopReviewResolver,
		AddShopReviewService,
		ShopsService,
		ReviewsService,
	],
	exports: [AddShopReviewService],
})
export class AddShopReviewModule {}
