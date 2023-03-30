import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/interface/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService, //
	) {}

	// 로그인하기
	@Mutation(() => String, { description: ' Return: 유저 로그인 ' })
	login(
		@Args('email') email: string, //
		@Args('password') password: string,
		@Context() context: IContext,
	): Promise<string> {
		return this.authService.login({
			email,
			password,
			req: context.req,
			res: context.res,
		});
	}

	// 로그아웃
	@UseGuards(GqlAuthGuard('access'))
	@Mutation(() => String, { description: ' return: 유저 로그아웃 ' })
	async logout(
		@Context() context: IContext, //
	) {
		return this.authService.logout({ req: context.req, res: context.res });
	}

	// accessToken 복원
	@UseGuards(GqlAuthGuard('refresh'))
	@Mutation(() => String, { description: ' Return: accessToken 복원 ' })
	restoreAccessToken(
		@Context() context: IContext, //
	): string {
		return this.authService.restoreAccessToken({ user: context.req.user });
	}
}
