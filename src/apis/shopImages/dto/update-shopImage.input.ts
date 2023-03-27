import { Field, InputType } from '@nestjs/graphql';
import { Shop } from 'src/apis/shops/entities/shop.entity';

@InputType()
export class UpdateShopImageInput {
	@Field(() => String)
	id: string;

	@Field(() => String)
	imageUrl: string;

	@Field(() => Boolean)
	isThumbnail: boolean;

	@Field(() => String, { nullable: true })
	shopId: string;
}
