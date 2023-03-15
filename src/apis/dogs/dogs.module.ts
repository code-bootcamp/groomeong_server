import { Module } from '@nestjs/common';
import { DogsResolver } from './dogs.resolver';
import { DogsService } from './dogs.service';

@Module({
	providers: [
		DogsResolver, //
		DogsService, //
	],
})
export class DogsModule {}
