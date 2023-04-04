import {
	ConflictException,
	Injectable,
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

	async create({
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

	async update({
		updateShopImageInput,
	}: IShopImagesServiceUpdate): Promise<ShopImage> {
		await this.shopImageRepository.delete({
			id: updateShopImageInput.id,
			imageUrl: updateShopImageInput.imageUrl,
		});
		return await this.shopImageRepository.save({
			...updateShopImageInput,
		});
	}

	async delete({ shopImageId }: IShopImagesServiceDelete): Promise<boolean> {
		const checkImage = await this.shopImageRepository.findOne({
			where: { id: shopImageId },
		});

		if (!checkImage) {
			throw new UnprocessableEntityException(
				`가게이미지ID가 ${shopImageId}인 이미지를 찾을 수 없습니다`,
			);
		}

		const result = await this.shopImageRepository.delete({
			id: shopImageId,
		});

		return result.affected ? true : false;
	}
}
