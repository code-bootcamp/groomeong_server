import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateShopInput } from './dto/create-shop.input';
import { ReturnShopOutput } from './dto/return-shop.output';
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
			'Return : DB에 등록된 가게 중 검색값을 포함한 데이터(검색값이 Null인 경우 모든 가게). 이미지는 썸네일만 불러오며, 등록된 이미지가 있더라도 썸네일로 지정한 이미지가 없는 경우 Null(빈 배열)',
	})
	fetchShops(
		@Args({
			name: 'search',
			nullable: true,
		})
		search: string, //
	): Promise<Shop[]> {
		// <--- 엘라스틱서치 적용 시 주석 해제 --->
		// const result = await this.elasticsearchService.search({
		// 	index: 'myshop02',
		// 	query: {
		// 		match: {
		// 			address: search,
		// 		},
		// 	},
		// });
		// console.log(JSON.stringify(result, null, ' '));
		// // result에서 필요한 데이터만 뽑아 프론트에 전달하면 될듯?
		// // 엘라스틱서치 적용 시, 서비스 구현되었을때 '가게이름'만 나오는지, 아니면 '가게 정보'전체가 다 나오는지에 따라 로직 설정이 달라질 것.

		return this.shopsService.findAll();
	}

	@Query(() => ReturnShopOutput, {
		description:
			'Return : 입력한 shopId와 일치하는 가게 데이터. 리뷰 작성 권한 확인 안 해줌 ',
	})
	fetchShop(
		@Args('shopId') shopId: string, //
	): Promise<Shop> {
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
	// async fetchShopsWithDeleted(): Promise<Shop[]> {
	// 	return await this.shopsService.findAllDeleted();
	// }

	// @Query(() => Shop, {
	// 	description: 'Return : 삭제된 가게 1개',
	// })
	// async fetchShopWithDeleted(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<Shop> {
	// 	return await this.shopsService.findDeleted({ shopId });
	// }

	// @Mutation(() => Boolean, {
	// 	description:
	// 		'Return : 가게 정보 삭제 완료 시 true',
	// })
	// async deleteShop(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<boolean> {
	// 	return await this.shopsService.delete({ shopId });
	// }

	// @Mutation(() => Boolean, {
	// 	description: 'Return : 가게 정보 복구 완료 시 true',
	// })
	// async restoreShop(
	// 	@Args('shopId') shopId: string, //
	// ): Promise<boolean> {
	// 	return await this.shopsService.restore({ shopId });
	// }
}
