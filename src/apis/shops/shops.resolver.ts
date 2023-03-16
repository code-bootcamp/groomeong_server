import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateShopInput } from './dto/create-shop.input';
import { UpdateShopInput } from './dto/update-shop.input';
import { Shop } from './entities/shop.entity';
import { ShopsService } from './shops.service';

@Resolver()
export class ShopsResolver {
	constructor(
		private readonly shopsService: ShopsService, //
	) {}

	@Query(() => [Shop])
	async fetchShops(): Promise<Shop[]> {
		return await this.shopsService.findAll();
	}

	@Query(() => Shop)
	async fetchShop(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		return await this.shopsService.findById({ shopId });
	}

	@Query(() => [Shop])
	async fetchShopsWithDeleted(): Promise<Shop[]> {
		return await this.shopsService.findAllDeleted();
	}

	@Query(() => Shop)
	async fetchShopWithDeleted(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		return await this.shopsService.findDeleted({ shopId });
	}

	@Mutation(() => Shop)
	createShop(
		@Args('createShopInput') createShopInput: CreateShopInput,
	): Promise<Shop> {
		const address = createShopInput.address;
		return this.shopsService.create({ address, createShopInput });
	}

	@Mutation(() => Shop)
	async updateShop(
		@Args('shopId') shopId: string,
		@Args('updateShopInput') updateShopInput: UpdateShopInput,
	): Promise<Shop> {
		return await this.shopsService.update({ shopId, updateShopInput });
	}

	@Mutation(() => Boolean)
	async deleteShop(
		@Args('shopId') shopId: string, //
	): Promise<boolean> {
		return await this.shopsService.delete({ shopId });
	}

	@Mutation(() => Boolean)
	async restoreShop(
		@Args('shopId') shopId: string, //
	): Promise<boolean> {
		return await this.shopsService.restore({ shopId });
	}
}
