import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateShopInput {
	@Field(() => String)
	name: string;

	@Field(() => String)
	phone: string;

	@Field(() => String)
	openHour: string;

	@Field(() => String)
	closeHour: string;

	@Field(() => String)
	address: string;

	@Field(() => Float, { nullable: true })
	averageStar?: number;
}
