import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
	@Field(() => String)
	writer: string;

	@Field(() => String)
	contents: string;

	@Field(() => Float)
	star: number;
}
