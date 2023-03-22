import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ShopImage } from './entities/shopImages.entity';
import { ShopImagesService } from './shopImage.service';

@Resolver()
export class ShopImagesResolver {
	constructor(
		private readonly shopImagesService: ShopImagesService, //
	) {}

	@Query(() => ShopImage, {
		description: 'Return: 가게이미지ID를 기준으로 1개의 가게이미지 가져오기',
	})
	async fetchShopImagesById(
		@Args('shopImageId') shopImageId: string, //
	): Promise<ShopImage> {
		return await this.shopImagesService.findById({ shopImageId });
	}

	@Query(() => [ShopImage], {
		description: 'Return: 가게ID를 기준으로 모든 가게이미지 배열 데이터',
	})
	fetchShopImagesByShopId(
		@Args('shopId') shopId: string, //
	): Promise<ShopImage[]> {
		return this.shopImagesService.findByShopId({ shopId });
	}

	@Mutation(() => ShopImage, {
		description: 'Return: 신규 생성된 가게이미지 데이터',
	})
	async saveShopImage(
		@Args('imageUrl') imageUrl: string,
		@Args('isThumbnail') isThumbnail: boolean,
		@Args('shopId') shopId: string,
	): Promise<ShopImage> {
		return await this.shopImagesService.save({ imageUrl, isThumbnail, shopId });
	}

	@Mutation(() => Boolean, {
		description: 'Return: 가게 이미지 삭제 완료 시, true',
	})
	deleteShopImage(
		@Args('shopImageId') shopImageId: string, //
	): Promise<boolean> {
		return this.shopImagesService.delete({ shopImageId });
	}
}
