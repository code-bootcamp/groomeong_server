import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from '../auth/strategies/jwt-access.strategy';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Shop } from '../shops/entities/shop.entity';
import { ShopsService } from '../shops/shops.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { Review } from './entities/review.entity';
import { ReviewsResolver } from './reviews.resolver';
import { ReviewsService } from './reviews.service';

@Module({
	imports: [
		JwtModule.register({}), //
		TypeOrmModule.forFeature([
			Shop, //
			User,
			Review,
			Reservation,
		]),
	],
	providers: [
		ReviewsResolver, //
		ReviewsService,
		UsersService,
		ShopsService,
		JwtAccessStrategy,
	],
})
export class ReviewsModule {}
