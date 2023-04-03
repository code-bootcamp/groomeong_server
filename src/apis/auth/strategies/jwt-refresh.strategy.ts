import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
	constructor(
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {
		super({
			jwtFromRequest: (req) => {
				const cookie = req.headers.cookie;
				if (cookie) return cookie.replace('refreshToken=', '');
			},
			secretOrKey: process.env.JWT_REFRESH_KEY,
			passReqToCallback: true,
		});
	}

	async validate(req, payload) {
		const myRefreshToken = req.headers['cookie'].split('refreshToken=')[1];

		const cache = await this.cacheManager.get(`refreshToken:${myRefreshToken}`);
		console.log('🐤🐤🐤🐤🐤🐤🐤jwtRefreshToken:', myRefreshToken);
		// 이 콘솔은 RefreshToken 확인하여야 하기 때문에 남겨둠!

		if (cache) {
			throw new UnauthorizedException('로그아웃 된 유저입니다');
		}
		return {
			email: payload.email, //
			id: payload.sub,
		};
	}
}
