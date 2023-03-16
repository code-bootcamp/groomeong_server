import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
	IAuthServiceGetAccessToken,
	IAuthServiceLogin,
} from './interface/auth.interface';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService, //

		private readonly jwtService: JwtService, //
	) {}

	// 로그인하기
	async login({
		email,
		password,
		req,
		res,
	}: IAuthServiceLogin): Promise<string> {
		// 의존성주입한 usersService 에서 email 찾아오기
		console.log('⭐️⭐️⭐️⭐️서비스로직⭐️⭐️⭐️⭐️', res);
		const user = await this.usersService.findOneByEmail({ email });

		// 일치하는 유저가 없으면 에러던지기!!
		if (!user) {
			throw new UnprocessableEntityException('이메일이 일치하지 않습니다!!');
		}

		// 이메일은 일치하지만 비밀번호가 일치하지 않으면 에러던지기!!
		const isAuth = await bcrypt.compare(password, user.password);
		if (!isAuth) {
			throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다!!');
		}

		// refreshToken(=JWT) 을 만들어서 브라우저 쿠키에 저장해서 보내주기
		this.setRefreshToken({ user, req, res });
		// 일치하는 유저가 있고 비밀번호도 맞았다면? accessToken 를 => JWT 만들어서 브라우저에 전달
		return this.getAccessToken({ user });
	}

	getAccessToken({ user }: IAuthServiceGetAccessToken): string {
		return this.jwtService.sign(
			{ sub: user.id }, //
			{ secret: process.env.JWT_ACCESS_KEY, expiresIn: '2w' },
		);
	}

	setRefreshToken({ user, req, res }) {
		const refreshToken = this.jwtService.sign(
			{ sub: user.id, email: user.email }, //
			{ secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
		);

		// 개발 환경
		res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/;`);
	}
}
