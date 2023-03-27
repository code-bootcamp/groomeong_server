import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopsService } from '../shops/shops.service';
import { ShopImage } from './entities/shopImages.entity';
import {
	IShopImagesServiceDelete,
	IShopImagesServiceFindByShopId,
	IShopImagesServiceFindThumbnail,
	IShopImagesServiceSave,
	IShopImagesServiceUpdate,
} from './interfaces/shopImages-service.interface';

@Injectable()
export class ShopImagesService {
	constructor(
		@InjectRepository(ShopImage)
		private readonly shopImageRepository: Repository<ShopImage>,
		private readonly shopsService: ShopsService,
	) {}

	// 가게ID로 썸네일 찾기
	async findThumbnailByShopId({
		shopId,
	}: IShopImagesServiceFindThumbnail): Promise<ShopImage> {
		const checkShop = await this.shopImageRepository.findOne({
			where: { shop: { id: shopId } },
		});

		if (!checkShop) {
			throw new UnprocessableEntityException(
				`썸네일 이미지를 찾을 수 없습니다`,
			);
		}

		return await this.shopImageRepository.findOne({
			where: { shop: { id: shopId }, isThumbnail: true },
			relations: ['shop'],
		});
	}

	// 가게ID로 해당 이미지 찾기
	async findByShopId({
		shopId,
	}: IShopImagesServiceFindByShopId): Promise<ShopImage[]> {
		const checkShop = await this.shopsService.findById({ shopId });

		if (!checkShop) {
			throw new UnprocessableEntityException(
				`가게ID가 ${shopId} 인 가게 정보를 찾을 수 없습니다`,
			);
		}

		return await this.shopImageRepository.find({
			where: { shop: { id: shopId } },
		});
	}

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

	// DB테이블에서 이미지 업데이트
	async update({
		updateShopImageInput,
	}: IShopImagesServiceUpdate): Promise<ShopImage> {
		await this.shopImageRepository.delete({
			id: updateShopImageInput.id,
			imageUrl: updateShopImageInput.imageUrl,
		});
		return await this.shopImageRepository.save({
			id: updateShopImageInput.id,
			imageUrl: updateShopImageInput.imageUrl,
			isThumbnail: updateShopImageInput.isThumbnail,
			shop: { id: updateShopImageInput.shopId },
		});
	}

	// DB테이블에서 이미지 삭제
	async delete({ shopImageId }: IShopImagesServiceDelete): Promise<boolean> {
		const checkImage = await this.shopImageRepository.findOne({
			where: { id: shopImageId },
		});

		if (!checkImage) {
			throw new UnprocessableEntityException(
				`가게이미지ID가 ${shopImageId}인 이미지를 찾을 수 없습니다`,
			);
		}
		console.log('찾았음');

		const result = await this.shopImageRepository.delete({
			id: shopImageId,
		});
		console.log('✨✨✨ 삭제 완료 ✨✨✨');

		return result.affected ? true : false;
	}
}
