import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_ACCESS_KEY,
		});
	}

	// 검증 성공하면 사용자의 정보(payload) 반환해주는 함수
	validate(payload) {
		console.log('🐹🐹🐹🐹🐹🐹', payload);
		return {
			email: payload.email, //
			id: payload.sub,
		};
	}
}
