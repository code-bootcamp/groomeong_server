import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import {
	IShopsServiceCreate,
	IShopsServiceDelete,
	IShopsServiceFindByAddress,
	IShopsServiceFindById,
	IShopsServiceFindByPhone,
	IShopsServiceFindDeleted,
	IShopsServiceFindOne,
	IShopsServiceRestore,
	IShopsServiceUpdate,
} from './interface/shops-service.interface';

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	async create({
		address,
		createShopInput,
	}: IShopsServiceCreate): Promise<Shop> {
		const checkShop = await this.shopsRepository.findOne({
			where: { address: address },
		});

		if (!checkShop) {
			throw new ConflictException(
				`해당 주소(${address})로 등록된 가게가 있습니다`,
			);
		}

		return await this.shopsRepository.save({ ...createShopInput });
	}

	async findById({ shopId }: IShopsServiceFindById): Promise<Shop> {
		return await this.shopsRepository.findOne({
			where: { id: shopId },
			// relations: ['reservation'],
		});
	}

	async findAll(): Promise<Shop[]> {
		return await this.shopsRepository.find({
			// relations: ['reservation'],
		});
	}

	async findByPhone({ phone }: IShopsServiceFindByPhone): Promise<Shop> {
		const result = await this.shopsRepository.findOne({
			where: { phone: phone },
		});

		if (!result) {
			throw new NotFoundException(
				`연락처가 ${phone}인 가게를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	async findByAddress({ address }: IShopsServiceFindByAddress): Promise<Shop> {
		const result = await this.shopsRepository.findOne({
			where: { address: address },
		});

		if (!result) {
			throw new NotFoundException(
				`주소가 ${address}인 가게를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	async findAllDeleted(): Promise<Shop[]> {
		return await this.shopsRepository.find({
			withDeleted: true,
			// relations: ['reservation'],
		});
	}

	async findDeleted({ shopId }: IShopsServiceFindDeleted): Promise<Shop> {
		const result = await this.shopsRepository.findOne({
			where: { id: shopId },
			withDeleted: true,
			// relations: ['reservation'],
		});

		if (!result) {
			throw new NotFoundException(
				`삭제된 목록에서 ID가 ${shopId}인 가게를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	async update({
		shopId,
		updateShopInput,
	}: IShopsServiceUpdate): Promise<Shop> {
		const checkShop = await this.shopsRepository.findOne({
			where: { id: shopId },
		});

		if (!checkShop) {
			throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
		}

		return this.shopsRepository.save({
			...updateShopInput,
		});
	}

	async delete({ shopId }: IShopsServiceDelete): Promise<boolean> {
		const checkShop = await this.shopsRepository.findOne({
			where: { id: shopId },
		});

		if (!checkShop) {
			throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
		}

		const result = await this.shopsRepository.softDelete({ id: shopId });

		return result.affected ? true : false;
	}

	async restore({ shopId }: IShopsServiceRestore): Promise<boolean> {
		const checkDeletedShop = await this.findDeleted({ shopId });

		if (!checkDeletedShop) {
			throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
		}

		const result = await this.shopsRepository.restore({ id: shopId });

		return result.affected ? true : false;
	}
}
