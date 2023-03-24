import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { Cache } from 'cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
	constructor(
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ACCESS_KEY,
			passReqToCallback: true,
		});
	}

	// 검증 성공하면 사용자의 정보(payload) 반환해주는 함수
	async validate(req, payload) {
		const myAccessToken = req.headers.authorization.split('Bearer ')[1];
		const cache = await this.cacheManager.get(`accessToken:${myAccessToken}`);
		console.log('🐹🐹🐹🐹🐹🐹jwtAccessToken', myAccessToken);
		// 이 콘솔은 accessToekn 확인하여야 하기 때문에 남겨둠!
		if (cache) {
			throw new UnauthorizedException('로그아웃 된 유저입니다.');
		}
		return {
			email: payload.email, //
			id: payload.sub,
		};
	}
}
