import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Shop } from "./entities/shop.entity";
import {
	IShopsServiceCreate,
	IShopsServiceDelete,
	IShopsServiceFindOne,
	IShopsServiceUpdate,
} from "./interface/shops-service.interface";

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop> //
	) {}

	async create({ createShopInput }: IShopsServiceCreate): Promise<Shop> {
		return await this.shopsRepository.save({ ...createShopInput });
	}

	async findAll(): Promise<Shop[]> {
		return await this.shopsRepository.find({
			// relations: ['reservation'],
		});
	}

	async findOne({ shopId }: IShopsServiceFindOne): Promise<Shop> {
		return await this.shopsRepository.findOne({
			where: { id: shopId },
			// relations: ['reservation'],
		});
	}

	async findAllDeleted(): Promise<Shop[]> {
		return await this.shopsRepository.find({
			withDeleted: true,
			// relations: ['reservation'],
		});
	}

	async findOneDeleted({ shopId }): Promise<Shop> {
		return await this.shopsRepository.findOne({
			where: { id: shopId },
			withDeleted: true,
			// relations: ['reservation'],
		});
	}

	async update({
		shopId,
		updateShopInput,
	}: IShopsServiceUpdate): Promise<Shop> {
		await this.shopsRepository.findOne({
			where: { id: shopId },
		});

		return this.shopsRepository.save({
			...updateShopInput,
		});
	}

	async delete({ shopId }: IShopsServiceDelete): Promise<boolean> {
		const result = await this.shopsRepository.softDelete({ id: shopId });

		return result.affected ? true : false;
	}
}
