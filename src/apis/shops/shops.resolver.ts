import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateShopInput } from './dto/create-shop.input';
import { PagedShopOutput, ReturnShopOutput } from './dto/return-shop.output';
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

		return this.shopsService.findAll();
	}

	@Query(() => [PagedShopOutput], {
		description:
			'Return : [페이지, [페이지의 포스트들]], DB에 등록된 가게 중 검색값을 포함한 데이터(검색값이 Null인 경우 모든 가게). 이미지는 썸네일만 불러오며, 등록된 이미지가 있더라도 썸네일로 지정한 이미지가 없는 경우 Null(빈 배열)',
	})
	async fetchShopsWithPaging(
		@Args({
			name: 'search',
			nullable: true,
		})
		search: string, //
		@Args('postsPerPage') postsPerPage: number,
	): Promise<PagedShopOutput[]> {
		// const searchResult = await this.elasticsearchService.search({
		// 	index: this.autocompleteIndex,
		// 	query: {
		// 		bool: {
		// 			should: [{ prefix: { address: search } }],
		// 		},
		// 	},
		// });
		// console.log(JSON.stringify(searchResult, null, ' '));
		// searchResult.hits.hits.forEach((hit) => console.log(hit._source));

		const allShopsData = await this.shopsService.findAll();
		const allDataCount: number = allShopsData.length;
		console.log(allDataCount);
		const allPageCount: number = Math.ceil(allDataCount / postsPerPage);

		const pagedShops = []; //페이지 수만큼 자리가 있는 배열 생성
		let i = 0;
		while (i < allPageCount) {
			// 페이지 수만큼 반복한다
			for (
				let j = i * postsPerPage;
				j < i * postsPerPage + postsPerPage && j < allDataCount;
				j++
			) {
				// 1페이지 ---> 가게 0번 ~ 4번 해당
				// i = 1 ---> j = [0,1,2,3,4]
				pagedShops.push({ page: i + 1, shop: allShopsData[j] });
			}
			i++;
		}
		console.log('🟥🟥 pagedShops 🟥🟥', pagedShops);
		return pagedShops;
	}

	@Query(() => ReturnShopOutput, {
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

	// // <--- 기능 필요하면 주석 해제 --->
	// @Query(() => [Shop], {
	// 	description: 'Return : 모든 삭제된 가게',
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
	// 	description: 'Return : 가게 정보 삭제 완료 시 true',
	// })
	// deleteShop(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<boolean> {
	// 	return this.shopsService.delete({ shopId });
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
