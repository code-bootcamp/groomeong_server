import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopsModule } from './apis/shops/shops.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		ShopsModule,
		ConfigModule.forRoot(),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			// autoSchemaFile: 'src/commons/graphql/schema.gql',
			context: ({ req, res }) => ({ req, res }),
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
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
