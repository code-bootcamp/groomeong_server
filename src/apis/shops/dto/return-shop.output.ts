import { Field, ObjectType, PartialType } from '@nestjs/graphql';
import { Shop } from '../entities/shop.entity';

@ObjectType()
export class ReturnShopOutput extends Shop {
	@Field(() => Boolean)
	hasReviewAuth: boolean;
}
