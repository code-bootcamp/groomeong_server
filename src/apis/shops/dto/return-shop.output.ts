import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Shop } from '../entities/shop.entity';

@ObjectType()
export class ReturnShopOutput extends Shop {
	@Field(() => Boolean)
	hasReviewAuth: boolean;
}

@ObjectType()
export class PagedShopOutput {
	@Field(() => Int)
	page: number;

	@Field(() => Shop)
	shop: Shop;
}
