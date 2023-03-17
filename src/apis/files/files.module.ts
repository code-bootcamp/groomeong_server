import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';

@Module({
	providers: [
		FilesResolver, //
		FilesService,
	],
})
export class FilesModule {}
