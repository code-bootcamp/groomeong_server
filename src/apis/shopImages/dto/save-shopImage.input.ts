import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SaveShopImageInput {
	@Field(() => String)
	imageUrl: string;

	@Field(() => Boolean)
	isThumbnail: boolean;

	@Field(() => String)
	shopId: string;
}
