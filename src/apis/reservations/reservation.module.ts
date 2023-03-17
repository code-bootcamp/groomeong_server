import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
		]),
	],
	providers: [
		ReservationsResolver, //
		ReservationsService,
		ShopsService,
		UsersService,
	],
})
export class ReservationsModule {}
