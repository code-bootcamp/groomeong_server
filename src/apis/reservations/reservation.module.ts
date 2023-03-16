import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationsResolver } from './reservation.resolver';
import { ReservationsService } from './reservation.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Reservation, //
			User,
		]),
	],
	providers: [
		ReservationsResolver, //
		ReservationsService,
	],
})
export class ReservationsModule {}
