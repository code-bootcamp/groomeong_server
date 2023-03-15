import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shops.entity';

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	async create({ createShopInput }): Promise<Shop> {
		return await this.shopsRepository.save({ ...createShopInput });
	}

	findAll() {}

	// findOne() {}

	// update() {}

	// delete() {}
}
