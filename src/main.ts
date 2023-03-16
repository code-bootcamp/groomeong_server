// import { ValidationPipe } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// 검증 위한 코드
	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(new HttpExceptionFilter());
	app.use(graphqlUploadExpress());
	await app.listen(3000);
}
bootstrap();
