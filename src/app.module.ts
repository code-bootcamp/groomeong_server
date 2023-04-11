import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DogsModule } from './apis/dogs/dogs.module';
import { FilesModule } from './apis/files/files.module';
import { GraphQLModule } from '@nestjs/graphql';
import { CacheModule, Module } from '@nestjs/common';
import { ShopsModule } from './apis/shops/shops.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './apis/users/user.module';
import { JwtAccessStrategy } from './apis/auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './apis/auth/strategies/jwt-refresh.strategy';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { JwtGoogleStrategy } from './apis/auth/strategies/jwt-social-google.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtKakaoStrategy } from './apis/auth/strategies/jwt-social-kakao.strategy';
import { ReservationsModule } from './apis/reservations/reservations.module';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { ShopImagesModule } from './apis/shopImages/shopImage.module';
import { AppController } from './app.controller';
import { AddShopReviewModule } from './apis/shop-review/shop-review.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

@Module({
	imports: [
		AddShopReviewModule,
		ShopsModule,
		AuthModule,
		DogsModule,
		FilesModule,
		ReservationsModule,
		ReviewsModule,
		ShopImagesModule,
		ShopsModule,
		UsersModule,
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			context: ({ req, res }) => ({ req, res }),
			cors: {
				origin: [
					'http://localhost:3000',
					'http://127.0.0.1:3000',
					'https://groomeong.store',
					'https://groomeong-backend.shop',
				],
				credentials: true,
			},
		}),
		ConfigModule.forRoot(),
		MailerModule.forRootAsync({
			useFactory: () => ({
				transport: {
					service: 'Gmail',
					host: process.env.EMAIL_HOST,
					port: Number(process.env.DATABASE_PORT),
					secure: false,
					auth: {
						user: process.env.EMAIL_USER,
						pass: process.env.EMAIL_PASS,
					},
					template: {
						dir: __dirname + '/templates/',
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true,
						},
					},
				},
			}),
		}),
		TypeOrmModule.forRoot({
			type: process.env.DATABASE_TYPE as 'mysql',
			host: process.env.DATABASE_HOST,
			port: Number(process.env.DATABASE_PORT),
			username: process.env.DATABASE_USERNAME,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_DATABASE,
			entities: [__dirname + '/apis/**/*.entity.*'],
			synchronize: true,
			logging: true,
		}),
		CacheModule.register<RedisClientOptions>({
			store: redisStore,
			url: `redis://${process.env.REDIS_HOST}:6379`,
			isGlobal: true,
		}),
	],
	providers: [
		JwtAccessStrategy, //
		JwtRefreshStrategy,
		JwtGoogleStrategy,
		JwtKakaoStrategy,
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
	controllers: [AppController],
})
export class AppModule {}
