import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateShopImageInput } from './dto/update-shopImage.input';
import { ShopImage } from './entities/shopImages.entity';
import { ShopImagesService } from './shopImage.service';

@Resolver()
export class ShopImagesResolver {
	constructor(
		private readonly shopImagesService: ShopImagesService, //
	) {}

	@Query(
		() => ShopImage, //
		{ description: 'Return: 입력한 가게의 썸네일 가게이미지(1개)' },
	)
	fetchThumbnailByShop(
		@Args('shopId') shopId: string, //
	): Promise<ShopImage> {
		return this.shopImagesService.findThumbnailByShopId({ shopId });
	}

	@Query(
		() => [ShopImage], //
		{ description: 'Return: 입력한 가게의 모든 가게이미지' },
	)
	fetchShopImagesByShop(
		@Args('shopId') shopId: string, //
	): Promise<ShopImage[]> {
		return this.shopImagesService.findByShopId({ shopId });
	}

	@Mutation(
		() => ShopImage, //
		{ description: 'Return: 신규 생성된 가게이미지 데이터' },
	)
	async createShopImage(
		@Args('imageUrl') imageUrl: string,
		@Args('isThumbnail') isThumbnail: boolean,
		@Args('shopId') shopId: string,
	): Promise<ShopImage> {
		return await this.shopImagesService.create({
			imageUrl,
			isThumbnail,
			shopId,
		});
	}

	@Mutation(
		() => ShopImage, //
		{ description: 'Return: 업데이트된 가게이미지 데이터' },
	)
	async updateShopImage(
		@Args('updateShopImageInput') updateShopImageInput: UpdateShopImageInput,
	): Promise<ShopImage> {
		return await this.shopImagesService.update({ updateShopImageInput });
	}

	@Mutation(
		() => Boolean, //
		{ description: 'Return: 가게 이미지 삭제 완료 시, true' },
	)
	deleteShopImage(
		@Args('shopImageId') shopImageId: string, //
	): Promise<boolean> {
		return this.shopImagesService.delete({ shopImageId });
	}
}
