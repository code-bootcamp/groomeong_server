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

	autocompleteIndex = 'autocomplete-shop-28';

	@Query(() => [Shop], {
		description:
			'Return : DB에 등록된 가게 중 검색값을 포함한 데이터(검색값이 Null인 경우 모든 가게). 이미지는 썸네일만 불러오며, 등록된 이미지가 있더라도 썸네일로 지정한 이미지가 없는 경우 Null(빈 배열)',
	})
	async fetchShops(
		@Args({
			name: 'search',
			nullable: true,
		})
		search: string, //
		@Args('page') page: number,
		@Args('count') count: number,
	): Promise<Shop[]> {
		const searchResult = await this.elasticsearchService.search({
			index: this.autocompleteIndex,
			query: {
				bool: {
					should: [{ prefix: { address: search } }],
				},
			},
		});
		console.log(JSON.stringify(searchResult, null, ' '));
		searchResult.hits.hits.forEach((hit) => console.log(hit._source));

		return this.shopsService.findAll({ page, count });
	}

	@Query(() => Shop, {
		description:
			'Return : 입력한 shopId와 일치하는 가게 데이터. 리뷰 작성 권한 확인 안 해줌 ',
	})
	async fetchShop(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		const searchResult = await this.elasticsearchService.search({
			index: this.autocompleteIndex,
			query: {
				match: {
					_id: shopId,
				},
			},
		});
		console.log(JSON.stringify(searchResult, null, ' '));

		return this.shopsService.findById({ shopId });
	}

	@Mutation(() => Shop, {
		description: 'Return : 신규 가게 데이터',
	})
	createShop(
		@Args('createShopInput') createShopInput: CreateShopInput,
	): Promise<Shop> {
		return this.shopsService.create({ createShopInput });
	}

	@Mutation(() => Shop, {
		description: 'Return : 수정 후 가게 데이터',
	})
	updateShop(
		@Args('shopId') shopId: string,
		@Args('updateShopInput') updateShopInput: UpdateShopInput,
	): Promise<Shop> {
		return this.shopsService.update({ shopId, updateShopInput });
	}

	//가게 삭제
	@Mutation(() => Boolean, {
		description: 'Return : 가게 정보 삭제 완료 시 true',
	})
	deleteShop(
		@Args('shopId') shopId: string, //
	): Promise<boolean> {
		return this.shopsService.delete({ shopId });
	}

	// // <--- 기능 필요하면 주석 해제 --->
	// //삭제된 가게 리스트 불러오기
	// @Query(() => [Shop], {
	// 	description: 'Return : 모든 삭제된 가게 목록',
	// })
	// fetchShopsWithDeleted(): Promise<Shop[]> {
	// 	return this.shopsService.findAllDeleted();
	// }

	// @Query(() => Shop, {
	// 	description: 'Return : 삭제된 가게 1개',
	// })
	// fetchShopWithDeleted(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<Shop> {
	// 	return this.shopsService.findDeleted({ shopId });
	// }

	// @Mutation(() => Boolean, {
	// 	description: 'Return : 가게 정보 복구 완료 시 true',
	// })
	// restoreShop(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<boolean> {
	// 	return this.shopsService.restore({ shopId });
	// }
}
