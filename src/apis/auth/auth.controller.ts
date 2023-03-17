import { AuthService } from './auth.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/user.service';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService, //
		private readonly usersService: UsersService,
	) {}

	@UseGuards(AuthGuard('google'))
	@Get('login/google')
	async loginGoogle(
		@Req() req: Request & IOAuthLoginUser, //
		@Res() res: Response,
	) {
		// 1. 회원조회
		let user = await this.usersService.findOneByEmail({
			email: req.user.email,
		});

		// 2. 회원가입이 안되어있다면? 자동 회원가입
		if (!user) user = await this.usersService.create({ ...req.user });

		// 3. 로그인 브라우저 전송
		this.authService.setRefreshToken({ user, res });
		res.redirect('http://localhost:3000/login/google');
	}
}

export interface IOAuthLoginUser {
	user: Pick<User, 'name' | 'email' | 'phone'>;
}
