import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { IContext } from 'src/commons/interface/context';
import {
	CACHE_MANAGER,
	Inject,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService, //

		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	// 로그인하기
	@Mutation(() => String, { description: ' Return: 유저 로그인 ' })
	login(
		@Args('email') email: string, //
		@Args('password') password: string,
		@Context() context: IContext,
	): Promise<string> {
		console.log('🐶🐶🐶🐶🐶', password);
		console.log('@@@@ refreshToken');
		return this.authService.login({
			email,
			password,
			req: context.req,
			res: context.res,
		});
	}

	// 소셜로그인 API

	// sologin()

	// 로그아웃
	@UseGuards(GqlAuthGuard('access'))
	@Mutation(() => String, { description: ' return: 유저 로그아웃 ' })
	async logout(@Context() context: IContext) {
		try {
			const accessToken = await context.req.headers['authorization'].replace(
				'Bearer ',
				'',
			);
			const refreshToken = await context.req.headers['cookie'].split(
				'refreshToken=',
			)[1];

			// accessToken 토큰
			const jwtAccessKey = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
			console.log(
				'🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧acc: ',
				jwt.verify(accessToken, 'myAccessKey'),
			);
			console.log('&&&&&&&&&&', refreshToken);

			// refresh 토큰
			const jwtRefreshKey = jwt.verify(
				refreshToken,
				process.env.JWT_REFRESH_KEY,
			);
			console.log(
				'🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧 myRefreshKey :',
				jwt.verify(refreshToken, 'myRefreshKey'),
			);

			await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
				ttl: jwtAccessKey['exp'] - jwtAccessKey['iat'],
			});
			console.log(accessToken);

			await this.cacheManager.set(
				`refreshToken:${refreshToken}`,
				'refreshToken',
				{
					ttl: jwtRefreshKey['exp'] - jwtRefreshKey['iat'],
				},
			);

			return '🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊🦊로그아웃에 성공했습니다.';
		} catch (err) {
			throw new UnauthorizedException('로그아웃을 실패했습니다.');
		}
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
