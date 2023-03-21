import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { DOG_TYPE } from '../enum/dog-type.enum';

@InputType()
export class CreateDogInput {
	@Field(() => String)
	name: string;

	@Field(() => Int)
	age: number;

	@Field(() => Float)
	weight: number;

	@Field(() => DOG_TYPE)
	breed: DOG_TYPE;

	@Field(() => String, { nullable: true })
	specifics: string;

	@Field(() => String, { nullable: true })
	image: string;
}
