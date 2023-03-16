import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/user.service';

@Module({
	imports: [
		JwtModule.register({}), //
		TypeOrmModule.forFeature([
			User, //
		]),
	],
	providers: [
		AuthResolver, //
		AuthService,
		JwtService,
		UsersService,
	],
})
export class AuthModule {}
