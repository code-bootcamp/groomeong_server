import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.stratehy';
import { UsersModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { JwtGoogleStrategy } from './strategies/jwt-social-google.strategy';

@Module({
	imports: [
		JwtModule.register({}), //
		TypeOrmModule.forFeature([
			User, //
		]),
		UsersModule,
	],
	providers: [
		AuthResolver, //
		AuthService,
		JwtService,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		JwtGoogleStrategy,
	],
	controllers: [AuthController],
})
export class AuthModule {}
