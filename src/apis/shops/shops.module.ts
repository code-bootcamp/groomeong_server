import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { Shop } from './entities/shop.entity';
import { ShopsResolver } from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
			Review,
		]),
		ElasticsearchModule.register({
			node: 'http://elasticsearch:9200', //
		}),
	],
	providers: [
		ShopsResolver, //
		ShopsService,
		ReviewsService,
	],
})
export class ShopsModule {}
