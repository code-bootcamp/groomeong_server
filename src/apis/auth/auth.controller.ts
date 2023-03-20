import { AuthService } from './auth.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/user.service';
import { Request, Response } from 'express';
import { IOAuthLoginUser } from './interface/auth.interface';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard-02';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService, //
		private readonly usersService: UsersService,
	) {}

	@Get('/login/:social')
	@UseGuards(DynamicAuthGuard)
	loginOAuth(
		@Req() req: Request & IOAuthLoginUser, //
		@Res() res: Response, //
	) {
		req.params;
		// OAuth 의 로직은 중복되기 때문에 auth.service에 하나의 함수를 만들어줘 합쳐준다.
		return this.authService.loginOAuth({ req, res });
	}

	// @UseGuards(AuthGuard('google'))
	// @Get('login/google')
	// async loginGoogle(
	// 	@Req() req: Request & IOAuthLoginUser, //
	// 	@Res() res: Response,
	// ) {
	// 	return this.authService.loginOAuth({ req, res });
	// }

	// @UseGuards(AuthGuard('kakao'))
	// @Get('/login/kakao')
	// loginOAuth(
	// 	@Req() req: Request & IOAuthLoginUser, //
	// 	@Res() res: Response, //
	// ) {
	// 	// OAuth 의 로직은 중복되기 때문에 auth.service에 하나의 함수를 만들어줘 합쳐준다.
	// 	return this.authService.loginOAuth({ req, res });
	// }
}
