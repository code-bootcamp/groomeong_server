import { Field, Float, InputType } from '@nestjs/graphql';

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

	@Field(() => String)
	image?: string;

	@Field(() => Float, { nullable: true })
	averageStar?: number;
}
