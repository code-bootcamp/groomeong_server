import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { Shop } from 'src/apis/shops/entities/shop.entity';

@ObjectType()
export class ShopWithAuthOutput extends Shop {
	@Field(() => Boolean)
	hasReviewAuth: boolean;
}
