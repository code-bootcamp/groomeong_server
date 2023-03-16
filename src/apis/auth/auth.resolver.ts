import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interface/context';

import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService, //
	) {}

	// 로그인하기
	@Mutation(() => String)
	login(
		@Args('email') email: string, //
		@Args('password') password: string,
		@Context() context: IContext,
	): Promise<string> {
		console.log('🐶🐶🐶🐶🐶', context.req, context.res);
		return this.authService.login({
			email,
			password,
			req: context.req,
			res: context.res,
		});
	}
}
