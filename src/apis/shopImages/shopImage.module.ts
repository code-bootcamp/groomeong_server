import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../shops/entities/shop.entity';
import { User } from '../users/entities/user.entity';
import { ShopImage } from './entities/shopImages.entity';
import { ShopImagesResolver } from './shopImage.resolver';
import { ShopImagesService } from './shopImage.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ShopImage, //
		]),
	],
	providers: [
		ShopImagesResolver, //
		ShopImagesService,
	],
})
export class ShopImagesModule {}
