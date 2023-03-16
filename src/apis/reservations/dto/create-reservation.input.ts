import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
	@Field(() => Date)
	date: Date;

	@Field(() => String)
	time: string;

	@Field(() => String)
	shopId: string;

	@Field(() => String)
	userId: string;

	@Field(() => String)
	dogId: string;
}
