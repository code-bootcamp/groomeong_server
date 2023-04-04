import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsService } from '../dogs/dogs.service';
import { Dog } from '../dogs/entities/dog.entity';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { Shop } from '../shops/entities/shop.entity';
import { ShopsService } from '../shops/shops.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { Reservation } from './entities/reservation.entity';
import { ReservationsResolver } from './reservations.resolver';
import { ReservationsService } from './reservations.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Reservation, //
			Review,
			User,
			Shop,
			Dog,
		]),
	],
	providers: [
		ReservationsResolver, //
		ReservationsService,
		ReviewsService,
		ShopsService,
		UsersService,
		DogsService,
	],
})
export class ReservationsModule {}
