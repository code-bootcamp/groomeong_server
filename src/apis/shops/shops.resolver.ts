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
	fetchShops(): Promise<Shop[]> {
		return this.shopsService.findAll();
	}

	@Query(() => Shop)
	fetchShop(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		return this.shopsService.findOne({ shopId });
	}

	@Query(() => [Shop])
	fetchShopsWithDeleted(): Promise<Shop[]> {
		return this.shopsService.findAllDeleted();
	}

	@Query(() => Shop)
	fetchShopWithDeleted(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		return this.shopsService.findOneDeleted({ shopId });
	}

	@Mutation(() => Shop)
	createShop(
		@Args('createShopInput') createShopInput: CreateShopInput,
	): Promise<Shop> {
		const phone = createShopInput.phone;
		return this.shopsService.create({ phone, createShopInput });
	}

	@Mutation(() => Shop)
	async updateShop(
		@Args('shopId') shopId: string,
		@Args('updateShopInput') updateShopInput: UpdateShopInput,
	): Promise<Shop> {
		return this.shopsService.update({ shopId, updateShopInput });
	}

	@Mutation(() => Boolean)
	deleteShop(
		@Args('shopId') shopId: string, //
	): Promise<boolean> {
		return this.shopsService.delete({ shopId });
	}

	@Mutation(() => Boolean)
	restoreShop(
		@Args('shopId') shopId: string, //
	): Promise<boolean> {
		return this.shopsService.restore({ shopId });
	}
}
