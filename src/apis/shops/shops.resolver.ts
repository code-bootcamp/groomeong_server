import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateShopInput } from './dto/create-shop.input';
import { AutocompleteShopsOutput } from './dto/return-shop.output';
import { UpdateShopInput } from './dto/update-shop.input';
import { Shop } from './entities/shop.entity';
import { ShopsService } from './shops.service';

@Resolver()
export class ShopsResolver {
	constructor(
		private readonly shopsService: ShopsService, //
		private readonly elasticsearchService: ElasticsearchService, //
	) {}

	@Query(
		() => [AutocompleteShopsOutput], //
		{
			nullable: true,
			description:
				'Return : 검색값(주소: 구, 동 검색 가능)을 포함한 데이터 배열(리뷰 점수 높은 순 정렬). 주소를 포함하는 데이터가 없는 경우 null.',
		},
	)
	async autocompleteShops(
		@Args({
			name: 'search',
			nullable: true,
		})
		searchKeyword: string, //
	): Promise<AutocompleteShopsOutput[]> {
		const searchResult = await this.elasticsearchService.search({
			index: 'auto_shop_1',
			body: {
				query: {
					multi_match: {
						query: searchKeyword,
						type: 'most_fields',
						fields: ['address.analyzed', 'address'],
					},
				},
			},
		});

		return this.shopsService.sortByAvgStar({
			hits: searchResult.body.hits.hits,
		});
	}

	@Query(
		() => [Shop], //
		{
			description:
				'Return : DB에 등록된 가게 중 검색값을 포함한 데이터(검색값이 Null인 경우 모든 가게). 이미지는 썸네일만 불러오며, 등록된 이미지가 있더라도 썸네일로 지정한 이미지가 없는 경우 Null(빈 배열)',
		},
	)
	async fetchShops(
		@Args('page') page: number,
		@Args('count') count: number,
	): Promise<Shop[]> {
		return this.shopsService.findAll({ page, count });
	}

	@Query(
		() => Shop, //
		{
			description:
				'Return : 입력한 shopId와 일치하는 가게 데이터. 리뷰 작성 권한 확인 안 해줌 ',
		},
	)
	async fetchShop(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
		return this.shopsService.findById({ shopId });
	}

	@Mutation(
		() => Shop, //
		{
			description: 'Return : 신규 가게 데이터',
		},
	)
	createShop(
		@Args('createShopInput') createShopInput: CreateShopInput,
	): Promise<Shop> {
		return this.shopsService.create({ createShopInput });
	}

	@Mutation(
		() => Shop, //
		{
			description: 'Return : 수정 후 가게 데이터',
		},
	)
	updateShop(
		@Args('shopId') shopId: string,
		@Args('updateShopInput') updateShopInput: UpdateShopInput,
	): Promise<Shop> {
		return this.shopsService.update({ shopId, updateShopInput });
	}

	@Mutation(
		() => Boolean, //
		{
			description: 'Return : 가게 정보 삭제 완료 시 true',
		},
	)
	deleteShop(
		@Args('shopId') shopId: string, //
	): Promise<boolean> {
		return this.shopsService.delete({ shopId });
	}
}
