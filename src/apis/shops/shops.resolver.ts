import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateShopInput } from './dto/create-shop.input';
import { UpdateShopInput } from './dto/update-shop.input';
import { Shop } from './entities/shop.entity';
import { ShopsService } from './shops.service';

@Resolver()
export class ShopsResolver {
	constructor(
		private readonly shopsService: ShopsService, //
		private readonly elasticsearchService: ElasticsearchService, //
	) {}

	@Query(() => [Shop], {
		description:
			'Return : DB에 등록된 가게 중 검색값을 포함한 데이터. Null인 경우 모든 가게',
	})
	async fetchShops(
		@Args({
			name: 'search',
			nullable: true,
		})
		search: string, //
	): Promise<Shop[]> {
		const result = await this.elasticsearchService.search({
			index: 'myshop02',
			query: {
				match: {
					address: search,
				},
			},
		});
		console.log(JSON.stringify(result, null, ' '));
		// result에서 필요한 데이터만 뽑아 프론트에 전달하면 될듯?
		// 엘라스틱서치 적용 시, 서비스 구현되었을때 '가게이름'만 나오는지, 아니면 '가게 정보'전체가 다 나오는지에 따라 로직 설정이 달라질 것.

		return await this.shopsService.findAll();
	}

	@Query(() => Shop, {
		description: 'Return : 입력한 shopId와 일치하는 가게(Shop) 데이터',
	})
	async fetchShop(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		return await this.shopsService.findById({ shopId });
	}

	@Query(() => Shop, {
		description: 'Return : 입력한 shopName과 일치하는 가게 데이터 1개',
	})
	async fetchFirstShopByName(
		@Args('shopName') shopName: string, //
	): Promise<Shop> {
		// 이름이 같은 가게가 있는 경우의 로직은 따로 작성 필요
		return await this.shopsService.findByName({ shopName });
	}

	// // 삭제 기능 생략되어 주석 처리함
	// @Query(() => [Shop], {
	// 	description: 'Return : DB에 등록된 모든 삭제된 가게(Shop) 데이터',
	// })
	// async fetchShopsWithDeleted(): Promise<Shop[]> {
	// 	return await this.shopsService.findAllDeleted();
	// }

	// // 삭제 기능 생략되어 주석 처리함
	// @Query(() => Shop, {
	// 	description: 'Return : 입력한 shopId와 일치하는 가게(Shop) 데이터',
	// })
	// async fetchShopWithDeleted(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<Shop> {
	// 	return await this.shopsService.findDeleted({ shopId });
	// }

	@Mutation(() => Shop, {
		description: 'Return : 새로 생성되어 DB에 저장된 신규 가게(Shop) 데이터',
	})
	createShop(
		@Args('createShopInput') createShopInput: CreateShopInput,
	): Promise<Shop> {
		const address = createShopInput.address;
		return this.shopsService.create({ address, createShopInput });
	}

	@Mutation(() => Shop, {
		description:
			'Return : 입력된 데이터로 수정되어 DB에 저장된 가게(Shop) 데이터',
	})
	async updateShop(
		@Args('shopId') shopId: string,
		@Args('updateShopInput') updateShopInput: UpdateShopInput,
	): Promise<Shop> {
		return await this.shopsService.update({ shopId, updateShopInput });
	}

	// // 삭제 기능 생략되어 주석 처리함
	// @Mutation(() => Boolean, {
	// 	description:
	// 		'Return : 가게 정보 삭제 완료 시 true. softdelete이므로 가게의 정보를 복원할 수 있습니다',
	// })
	// async deleteShop(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<boolean> {
	// 	return await this.shopsService.delete({ shopId });
	// }

	// // 삭제 기능 생략되어 주석 처리함
	// @Mutation(() => Boolean, {
	// 	description: 'Return : 가게 정보 복구 완료 시 true.',
	// })
	// async restoreShop(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<boolean> {
	// 	return await this.shopsService.restore({ shopId });
	// }
}
