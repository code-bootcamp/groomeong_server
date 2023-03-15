import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { query } from 'express';
import { CreateShopInput } from './dto/create-shop.input';
import { Shop } from './entities/shops.entity';
import { ShopsService } from './shops.service';

@Resolver()
export class ShopsResolver {
	constructor(
		private readonly shopsService: ShopsService, //
	) {}

	@Query(() => String)
	fetchshop() {
		return 'graphQL 동작을 위한 임시쿼리문입니다!!';
	}

	@Mutation(() => Shop)
	createShop(
		@Args('createShopInput') createShopInput: CreateShopInput,
	): Promise<Shop> {
		return this.shopsService.create({ createShopInput });
	}
}
