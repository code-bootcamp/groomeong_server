import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsResolver } from './dogs.resolver';
import { DogsService } from './dogs.service';
import { Dog } from './entities/dog.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Dog, //
		]),
	],
	providers: [
		DogsResolver, //
		DogsService, //
	],
})
export class DogsModule {}
