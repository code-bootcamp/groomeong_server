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
	shopid: string;

	@Field(() => String)
	name: string;

	@Field(() => String)
	lat: string;

	@Field(() => String)
	lng: string;

	@Field(() => String)
	phone: string;

	@Field(() => String)
	openhour: string;

	@Field(() => String)
	closehour: string;

	@Field(() => String)
	address: string;

	@Field(() => Int)
	averagestar: number;

	@Field(() => String)
	id: string;

	@Field(() => String)
	imageurl: string;

	@Field(() => Int)
	isthumbnail: number;
}
