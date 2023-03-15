import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DogsModule } from './apis/dogs/dogs.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		DogsModule, //
		TypeOrmModule.forRoot({
			type: process.env.DATABASE_TYPE as 'mysql',
			host: process.env.DATABASE_HOST,
			port: Number(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASEA_PASSWORD,
			entities: [__dirname + '/apis/**/*.entity.*'],
			logging: true,
			synchronize: true,
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
