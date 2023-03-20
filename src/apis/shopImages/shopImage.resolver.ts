import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SaveShopImageInput } from './dto/save-shopImage.input';
import { ShopImage } from './entities/shopImages.entity';
import { ShopImagesService } from './shopImage.service';

@Resolver()
export class ShopImagesResolver {
	constructor(
		private readonly shopImagesService: ShopImagesService, //
	) {}

	// @Query(() => ShopImage, {
	// 	description: 'Return: 가게ID를 기준으로 모든 가게이미지 배열 데이터',
	// })
	// async fetchShopImagesByShopId(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<ShopImage[]> {
	// 	return await this.shopImagesService.findByShopId({ shopId });
	// }

	@Query(() => ShopImage, {
		description: 'Return: 가게이미지ID를 기준으로 1개의 가게이미지 가져오기',
	})
	async fetchShopImagesById(
		@Args('shopImageId') shopImageId: string, //
	): Promise<ShopImage> {
		return await this.shopImagesService.findById({ shopImageId });
	}

	@Mutation(() => ShopImage, {
		description: 'Return: 신규 생성된 가게이미지 데이터',
	})
	async saveShopImage(
		@Args('saveShopImageInput') saveShopImageInput: SaveShopImageInput,
	): Promise<ShopImage> {
		const imageUrl = saveShopImageInput.imageUrl;
		return await this.shopImagesService.save({ imageUrl, saveShopImageInput });
	}

	@Mutation(() => ShopImage, {
		description: 'Return: 가게 이미지 삭제 완료 시, true',
	})
	async deleteShopImage(
		@Args('shopImageId') shopImageId: string, //
	): Promise<boolean> {
		return await this.shopImagesService.delete({ shopImageId });
	}
}
