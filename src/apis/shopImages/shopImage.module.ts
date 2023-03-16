import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../shops/entities/shop.entity';
import { User } from '../users/entities/user.entity';
import { Reservation } from './entities/reservation.entity';
import { ShopImage } from './entities/shopImages.entity';
import { ReservationsResolver } from './reservation.resolver';
import { ReservationsService } from './reservation.service';
import { ShopImagesResolver } from './shopImage.resolver';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
			ShopImage,
		]),
	],
	providers: [
		ShopImagesResolver, //
		ShopImagesResolver,
	],
})
export class ShopImagesModule {}
