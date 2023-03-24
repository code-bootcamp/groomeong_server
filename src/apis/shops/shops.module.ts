import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddShopReviewService } from 'src/apis/shop-review/shop-review.service';
import { Shop } from './entities/shop.entity';
import { ShopsResolver } from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
		]),
		ElasticsearchModule.register({
			node: 'http://elasticsearch:9200', //
		}),
	],
	providers: [
		ShopsResolver, //
		ShopsService,
	],
	exports: [
		ShopsService, //
	],
})
export class ShopsModule {}
