import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from '../shops/entities/shop.entity';
import { ShopsService } from '../shops/shops.service';
import { ShopImage } from './entities/shopImages.entity';
import { ShopImagesResolver } from './shopImage.resolver';
import { ShopImagesService } from './shopImage.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			ShopImage, //
			Shop,
		]),
	],
	providers: [
		ShopImagesResolver, //
		ShopImagesService,
		ShopsService,
	],
})
export class ShopImagesModule {}
