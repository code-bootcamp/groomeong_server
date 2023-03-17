import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './apis/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DogsModule } from './apis/dogs/dogs.module';
import { FilesModule } from './apis/files/files.module';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { ShopsModule } from './apis/shops/shops.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './apis/users/user.module';
import { JwtAccessStrategy } from './apis/auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './apis/auth/strategies/jwt-refresh.stratehy';

@Module({
	imports: [
		AuthModule, //
		DogsModule,
		FilesModule,
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
	],
	providers: [
		JwtAccessStrategy, //
		JwtRefreshStrategy,
	],
})
export class AppModule {}
