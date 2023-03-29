import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/login/google',
			scope: ['email', 'profile'],
		});
	}

	validate(accessToken: string, refreshToken: string, profile: Profile) {
		console.log('⚽️⚽️⚽️google acc:', accessToken);
		console.log('🏀🏀🏀google refresh:', refreshToken);
		console.log('🍏🍏🍏google profile:', profile);
		// console.log('@@@@@@res:', res);

		return {
			name: profile.displayName,
			email: profile.emails[0].value,
			password: 'qwe!@1234',
			phone: '01000001111',
		};
	}
}
