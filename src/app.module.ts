import { Module } from '@nestjs/common';
import { DogsModule } from './apis/dogs/dogs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		DogsModule, //
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
