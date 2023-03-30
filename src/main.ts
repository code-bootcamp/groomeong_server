import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.use(graphqlUploadExpress());
	app.enableCors({
		origin: [
			'http://localhost:3000',
			'http://127.0.0.1:3000',
			'http://34.64.53.80:3000',
			'https://groomeong.shop',
			'https://groomeong.store',
		],
		credentials: true,
	});
	await app.listen(3000);
}
bootstrap();
