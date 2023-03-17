import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
	) {}

	// DB테이블에 신규 이미지 저장
	async save({
		shopId,
		saveShopImageInput,
	}: IShopImagesServiceSave): Promise<ShopImage> {
		// this.findByShopId({ shopId });
		return await this.shopImageRepository.save(saveShopImageInput);
	}

	// 가게이미지ID로 해당 이미지 찾기
	async findById({
		shopImageId,
	}: IShopImagesServiceFindById): Promise<ShopImage> {
		const result = await this.shopImageRepository.findOne({
			where: { id: shopImageId },
		});

		if (!result) {
			throw new NotFoundException(
				`가게이미지ID가 ${shopImageId}인 이미지를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// // 가게ID로 해당 이미지 찾기
	// async findByShopId({
	// 	shopId,
	// }: IShopImagesServiceFindByShopId): Promise<ShopImage[]> {
	// 	const result = await this.shopImageRepository.find({
	// 		where: { shop: { id: shopId } },
	// 	});

	// 	if (!result) {
	// 		throw new NotFoundException(
	// 			`가게ID가 ${shopId}인 가게 정보를 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return result;
	// }

	// 가게이미지ID로 DB테이블에서 이미지 삭제
	async delete({ shopImageId }: IShopImagesServiceDelete): Promise<boolean> {
		this.findById({ shopImageId });
		const result = await this.shopImageRepository.delete({
			id: shopImageId,
		});

		return result.affected ? true : false;
	}
}
