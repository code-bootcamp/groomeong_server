import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import {
	IAuthServiceGetAccessToken,
	IAuthServiceLogin,
	IAuthServiceLogOut,
	IAuthServiceRestoreAccessToken,
	IAuthServiceSetRefreshToken,
	ILoginService,
} from './interface/auth.interface';
import {
	CACHE_MANAGER,
	Inject,
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService, //
		private readonly jwtService: JwtService, //

		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	// 로그인하기
	async login({
		email,
		password,
		req,
		res,
	}: IAuthServiceLogin): Promise<string> {
		const user = await this.usersService.findOneByEmail({ email });
		if (!user) {
			throw new UnprocessableEntityException('이메일이 일치하지 않습니다!!');
		}

		const isAuth = await bcrypt.compare(password, user.password);
		if (!isAuth) {
			throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다!!');
		}

		// refreshToken(=JWT) 을 만들어서 브라우저 쿠키에 저장해서 보내주기
		this.setRefreshToken({ user, req, res });
		// 일치하는 유저가 있고 비밀번호도 맞았다면? accessToken 를 => JWT 만들어서 브라우저에 전달
		return this.getAccessToken({ user });
	}

	async logout({ req, res }: IAuthServiceLogOut) {
		try {
			const accessToken = req.headers['authorization'].replace('Bearer ', '');
			const refreshToken = req.headers['cookie'].split('refreshToken=')[1];

			const jwtAccessKey = jwt.verify(
				accessToken, //
				process.env.JWT_ACCESS_KEY,
			);

			const jwtRefreshKey = jwt.verify(
				refreshToken,
				process.env.JWT_REFRESH_KEY,
			);

			await this.cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
				ttl: jwtAccessKey['exp'] - jwtAccessKey['iat'],
			});

			await this.cacheManager.set(
				`refreshToken:${refreshToken}`,
				'refreshToken',
				{
					ttl: jwtRefreshKey['exp'] - jwtRefreshKey['iat'],
				},
			);

			return '로그아웃 성공';
		} catch (err) {
			throw new UnauthorizedException('로그아웃 실패');
		}
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

		const originList = [
			'http://localhost:3000',
			'http://127.0.0.1:3000',
			'http://34.64.53.80:3000',
			'https://groomeong.shop',
			'https://groomeong.store',
		];
		const origin = req.headers.origin;
		if (originList.includes(origin)) {
			// 리소스에 엑세스하기 위해 코드 요청을 허용하도록 브라우저에 알리는 응답
			res.setHeader('Access-Control-Allow-Origin', origin);
		}

		// 프런트엔드 js 코드에 대한 응답을 노출할지 여부를 브라우저에 알려준다.
		res.setHeader('Access-Control-Allow-Credentials', 'true');
		// 리소스에 엑세스할 때 허용되는 하나 이상의 메서드를 지정해준다.
		res.setHeader(
			'Access-Control-Allow-Methods', //
			'GET, HEAD, OPTIONS, POST, PUT',
		);
		// 실제 요청 중에 사용할 수 있는 HTTP 헤더를 나타내는 실행 전 요청에 대한 응답.
		// X-Custom-Header => 서버에 대한 cors 요청에 의해 지원
		// Upgrade-Insecure-Requests => 여러 헤더에 대한 지원을 지정
		res.setHeader(
			'Access-Control-Allow-Headers', //
			'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
		);

		res.setHeader(
			'Set-Cookie',
			`refreshToken=${refreshToken}; path=/; domain=.groomeong.shop; Secure; httpOnly; SameSite=None;`,
		);
	}

	async loginOAuth({ req, res }: ILoginService): Promise<void> {
		let user = await this.usersService.findOneByEmail({
			email: req.user.email,
		});
		if (!user) {
			user = await this.usersService.create({ ...req.user });
		}

		this.setRefreshToken({ user, res, req });
		res.redirect('https://groomeong.store');
	}
}
