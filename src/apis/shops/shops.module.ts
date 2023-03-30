import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopsResolver } from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
		]),
		ElasticsearchModule.register({
			node: 'http://elasticsearch:9200', // 로컬

			// 배포
			// node: 'https://search-groomeong-elasticsearch-7mvk7xnf5m2a6tcx6p5ro5qste.ap-southeast-2.es.amazonaws.com:443',
			// auth: {
			// 	username: process.env.OPENSEARCH_ID,
			// 	password: process.env.OPENSEARCH_PWD,
			// },
			// headers: {
			// 	Accept: 'application/json',
			// 	'Content-Type': 'application/json',
			// },
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
