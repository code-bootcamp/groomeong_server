import { AuthService } from './auth.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IOAuthLoginUser } from './interface/auth.interface';
import { DynamicAuthGuard } from './guards/dynamic-auth.guard-02';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService, //
	) {}

	@Get('/login/:social')
	@UseGuards(DynamicAuthGuard)
	loginOAuth(
		@Req() req: Request & IOAuthLoginUser, //
		@Res() res: Response, //
	) {
		// OAuth 의 로직은 중복되기 때문에 auth.service에 하나의 함수를 만들어줘 합쳐준다.
		return this.authService.loginOAuth({ req, res });
	}
}
