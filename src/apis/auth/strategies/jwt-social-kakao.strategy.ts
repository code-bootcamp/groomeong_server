import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'KaKao') {
	constructor() {
		super({
			clientID: process.env.KAKAO_CLIENT_ID,
			clientSecret: process.env.KAKAO_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/login/kakao',
			scope: ['account_email', 'profile_nickname'],
		});
	}

	validate(accessToken: string, refreshToken: string, profile: Profile) {
		console.log('⚽️⚽️⚽️kakao acc:', accessToken);
		console.log('🏀🏀🏀kakao refresh:', refreshToken);
		console.log('🍏🍏🍏kakao profile:', profile);
		console.log('@@@email', profile._json.kakao_account.email);

		// console.log('@@@@@@res:', res);

		return {
			name: profile.displayName,
			email: profile._json.kakao_account.email,
		};
	}
}