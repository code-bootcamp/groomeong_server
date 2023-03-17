import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../shops/entities/shop.entity';
import { ShopsService } from '../shops/shops.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
			User,
			Review,
		]),
	],
	providers: [
		ReviewsResolver, //
		ReviewsService,
		UsersService,
		ShopsService,
	],
})
export class ReviewsModule {}
