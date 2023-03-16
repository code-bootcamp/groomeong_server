import { AuthService } from './auth.service';
import { Controller } from '@nestjs/common';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService, //
	) {}
}
