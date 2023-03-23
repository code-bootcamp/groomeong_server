import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
	@Field(() => String, { nullable: true })
	name: string;

	@Field(() => String, { nullable: true })
	password: string;

	@Field(() => String, { nullable: true })
	phone: string;

	@Field(() => String, { nullable: true })
	image: string;
}
