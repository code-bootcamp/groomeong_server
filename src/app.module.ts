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
import { JwtRefreshStrategy } from './apis/auth/strategies/jwt-refresh.stratehy';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { JwtGoogleStrategy } from './apis/auth/strategies/jwt-social-google.strategy';
import { ReservationsModule } from './apis/reservations/reservation.module';
import { ReviewsModule } from './apis/reviews/reviews.module';
import { ShopImagesModule } from './apis/shopImages/shopImage.module';

@Module({
	imports: [
		AuthModule, //
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
		}),
		ConfigModule.forRoot(),
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
			url: 'redis://my-redis:6379',
			isGlobal: true,
		}),
	],
	providers: [
		JwtAccessStrategy, //
		JwtRefreshStrategy,
		JwtGoogleStrategy,
	],
})
export class AppModule {}
