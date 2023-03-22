import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsService } from '../dogs/dogs.service';
import { Dog } from '../dogs/entities/dog.entity';
import { Shop } from '../shops/entities/shop.entity';
import { ShopsService } from '../shops/shops.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { Reservation } from './entities/reservation.entity';
import { ReservationsResolver } from './reservation.resolver';
import { ReservationsService } from './reservation.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Reservation, //
			User,
			Shop,
			Dog,
		]),
	],
	providers: [
		ReservationsResolver, //
		ReservationsService,
		ShopsService,
		UsersService,
		DogsService,
	],
})
export class ReservationsModule {}
