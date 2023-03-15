import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { CreateShopInput } from "./dto/create-shop.input";
import { Shop } from "./entities/shop.entity";
import { ShopsService } from "./shops.service";

@Resolver()
export class ShopsResolver {
	constructor(
		private readonly shopsService: ShopsService //
	) {}

	@Query(() => [Shop])
	fetchShops(): Promise<Shop[]> {
		return this.shopsService.findAll();
	}

	@Query(() => Shop)
	fetchShop(
		@Args("shopId") shopId: string //
	): Promise<Shop> {
		return this.shopsService.findOne({ shopId });
	}

	@Query(() => [Shop])
	fetchShopsWithDeleted(): Promise<Shop[]> {
		return this.shopsService.findAllDeleted();
	}

	@Query(() => Shop)
	fetchShopWithDeleted(
		@Args("shopId") shopId: string //
	): Promise<Shop> {
		return this.shopsService.findOneDeleted({ shopId });
	}

	@Mutation(() => Shop)
	createShop(
		@Args("createShopInput") createShopInput: CreateShopInput
	): Promise<Shop> {
		return this.shopsService.create({ createShopInput });
	}
}
