import * as bcrypt from 'bcrypt';
import {
	IAuthServiceGetAccessToken,
	IAuthServiceLogin,
	IAuthServiceRestoreAccessToken,
	IAuthServiceSetRefreshToken,
} from './interface/auth.interface';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService, //

		private readonly jwtService: JwtService, //
	) {}

	// 로그인하기
	async login({
		email,
		password,
		req,
		res,
	}: IAuthServiceLogin): Promise<string> {
		// 의존성주입한 usersService 에서 email 찾아오기
		console.log('⭐️⭐️⭐️⭐️서비스로직⭐️⭐️⭐️⭐️');
		const user = await this.usersService.findOneByEmail({ email });

		// 일치하는 유저가 없으면 에러던지기!!
		if (!user) {
			throw new UnprocessableEntityException('이메일이 일치하지 않습니다!!');
		}

		// 이메일은 일치하지만 비밀번호가 일치하지 않으면 에러던지기!!
		const isAuth = await bcrypt.compare(password, user.password);
		if (!isAuth) {
			throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다!!');
		}

		// refreshToken(=JWT) 을 만들어서 브라우저 쿠키에 저장해서 보내주기
		this.setRefreshToken({ user, req, res });
		// 일치하는 유저가 있고 비밀번호도 맞았다면? accessToken 를 => JWT 만들어서 브라우저에 전달
		return this.getAccessToken({ user });
	}

	restoreAccessToken({ user }: IAuthServiceRestoreAccessToken): string {
		return this.getAccessToken({ user });
	}

	getAccessToken({ user }: IAuthServiceGetAccessToken): string {
		return this.jwtService.sign(
			{ sub: user.id, email: user.email }, //ƒ
			{ secret: process.env.JWT_ACCESS_KEY, expiresIn: '2w' },
		);
	}

	setRefreshToken({ user, req, res }: IAuthServiceSetRefreshToken) {
		const refreshToken = this.jwtService.sign(
			{ sub: user.id, email: user.email }, //
			{ secret: process.env.JWT_REFRESH_KEY, expiresIn: '2w' },
		);

		// 개발 환경
		res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/;`);

		// 배포 환경 ============== 배포 하기 전까지 잠시 주석 =============

		// const originList = [
		// 	'http://localhost:3000',
		// 	// 가비아에서 배포된 도매인 주소 http:// .....
		// 	// ssl 된 주소 https:// .....
		// ];
		// const origin = req.header.origin;
		// if (originList.includes(origin)) {
		// 	// 리소스에 엑세스하기 위해 코드 요청을 허용하도록 브라우저에 알리는 응답
		// 	res.setHeader('Access-Control-Allow-Origin', origin);
		// }

		// // 프런트엔드 js 코드에 대한 응답을 노출할지 여부를 브라우저에 알려준다.
		// res.setHeader('Access-Control-Allow-Credentials', 'true');
		// // 리소스에 엑세스할 때 허용되는 하나 이상의 메서드를 지정해준다.
		// res.setHeader(
		// 	'Access-Control-Allow-Methods', //
		// 	'GET, HEAD, OPTIONS, POST, PUT',
		// );
		// // 실제 요청 중에 사용할 수 있는 HTTP 헤더를 나타내는 실행 전 요청에 대한 응답.
		// // X-Custom-Header => 서버에 대한 cors 요청에 의해 지원
		// // Upgrade-Insecure-Requests => 여러 헤더에 대한 지원을 지정
		// res.setHeader(
		// 	'Access-Control-Allow-Headers', //
		// 	'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
		// );

		// res.setHeader(
		// 	'Set-Cookie',
		// 	`refreshToken=${refreshToken}; path=/; domain=.그루멍 주소 ; Secure; httpOnly; SameSite=None;`,
		// );
	}
}
