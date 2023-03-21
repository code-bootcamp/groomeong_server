import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopsService } from '../shops/shops.service';
import { ShopImage } from './entities/shopImages.entity';
import {
	IShopImagesServiceDelete,
	IShopImagesServiceFindById,
	IShopImagesServiceFindByShopId,
	IShopImagesServiceSave,
} from './interfaces/shopImages-service.interface';

@Injectable()
export class ShopImagesService {
	constructor(
		@InjectRepository(ShopImage)
		private readonly shopImageRepository: Repository<ShopImage>,
		private readonly shopsService: ShopsService,
	) {}

	// DB테이블에 신규 이미지 저장
	async save({
		imageUrl,
		isThumbnail,
		shopId,
	}: IShopImagesServiceSave): Promise<ShopImage> {
		const checkURL = await this.shopImageRepository.findOne({
			where: { imageUrl: imageUrl },
		});
		if (checkURL) {
			throw new ConflictException('이미 등록된 이미지URL 입니다');
		}

		return await this.shopImageRepository.save({
			imageUrl: imageUrl,
			isThumbnail: isThumbnail,
			shop: { id: shopId },
		});
	}

	// 가게이미지ID로 해당 이미지 찾기
	async findById({
		shopImageId,
	}: IShopImagesServiceFindById): Promise<ShopImage> {
		const result = await this.shopImageRepository.findOne({
			where: { id: shopImageId },
			relations: ['shop'],
		});

		if (!result) {
			throw new NotFoundException(
				`가게이미지ID가 ${shopImageId}인 이미지를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// 가게ID로 해당 이미지 찾기
	async findByShopId({
		shopId,
	}: IShopImagesServiceFindByShopId): Promise<ShopImage[]> {
		const checkShop = await this.shopsService.findById({ shopId });
		if (!checkShop) {
			throw new NotFoundException(
				`가게ID가 ${shopId} 인 가게 정보를 찾을 수 없습니다`,
			);
		}

		const images = await this.shopImageRepository.find({
			where: { shop: { id: shopId } },
		});

		// const result = [];
		// images.forEach((el) => {
		// 	result.push({
		// 		id: el.id,
		// 		imageUrl: el.imageUrl,
		// 		isThumbnail: el.isThumbnail,
		// 	});
		// });

		// console.log(result);
		console.log(images);
		return images;
	}

	// 가게이미지ID로 DB테이블에서 이미지 삭제
	async delete({ shopImageId }: IShopImagesServiceDelete): Promise<boolean> {
		await this.findById({ shopImageId });

		const result = await this.shopImageRepository.delete({
			id: shopImageId,
		});
		console.log('✨✨✨ 삭제 완료 ✨✨✨');

		return result.affected ? true : false;
	}
}
