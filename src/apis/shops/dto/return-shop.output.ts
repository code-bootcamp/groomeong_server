import { Field, Int, ObjectType } from '@nestjs/graphql';
import { isNullableType } from 'graphql';
import { Shop } from '../entities/shop.entity';

@ObjectType()
export class ReturnShopOutput extends Shop {
	@Field(() => Boolean)
	hasReviewAuth: boolean;
}

@ObjectType()
export class AutocompleteShopsOutput {
	@Field(() => String)
	shopId: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	lat: string;

	@Field(() => String)
	lng: string;

	@Field(() => String)
	phone: string;

	@Field(() => String)
	openHour: string;

	@Field(() => String)
	closeHour: string;

	@Field(() => String)
	address: string;

	@Field(() => Int)
	averageStar: number;

	@Field(() => String)
	id: string;

	@Field(() => String)
	imageUrl: string;

	@Field(() => Int)
	isThumbnail: number;
}
