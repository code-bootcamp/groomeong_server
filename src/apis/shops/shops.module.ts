import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopsResolver } from './shops.resolver';
import { ShopsService } from './shops.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Shop, //
		]),
	],
	providers: [
		ShopsResolver, //
		ShopsService,
	],
})
export class ShopsModule {}
