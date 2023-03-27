import { MailerModule } from '@nestjs-modules/mailer';
import {
	CACHE_MANAGER,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { UsersService } from 'src/apis/users/user.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { MockUsersRepository } from './auth.mocking.dummy';

const EXAMPLE_ACCESS_TOKEN = 'exampleAccessToken';
const EXAMPLE_ACCESS_TOKEN_NEW = 'new-exampleAccessToken';
const EXAMPLE_REFRESH_TOKEN = 'exampleRefreshToken';
const EXAMPLE_REFRESH_TOKEN_NEW = 'new-exampleRefreshToken';
// const EXAMPLE_Req = [
// 	[
// {
// 	headers: {
// 		authorization: `Bearer ${EXAMPLE_ACCESS_TOKEN}`,
// 		cookie: `refreshToken=${EXAMPLE_REFRESH_TOKEN}`, //로그아웃을 위해 입력
// 	},
// 		},
// 	],
// ];
// const EXAMPLE_Res = [
// 	[
// 		{
// 			headers: {
// 				cookie: `refreshToken=${EXAMPLE_REFRESH_TOKEN}`,
// 			},
// 		},
// 	],
// ];
const EXAMPLE_Redis: any = [];
const EXAMPLE_Req = [
	[
		{
			headers: {
				authorization: `Bearer exampleAccessToken`,
				cookie: `refreshToken=exampleRefreshToken`, //로그아웃을 위해 입력
			},
		},
	],
];
const EXAMPLE_Res = [
	[
		{
			headers: {
				cookie: `refreshToken=exampleRefreshToken`,
			},
		},
	],
];

// const EXAMPLE_validate = (req, payload) => {
// 	const temp = req.header.Authorization;
// 	payload = EXAMPLE_USER;
// 	const accessToken = temp.toLowercase().replace('bearer ', '');

// 	try {
// 		accessToken === EXAMPLE_ACCESS_TOKEN;
// 	} catch (error) {
// 		throw new UnauthorizedException('');
// 	}

// 	return payload;
// };

const EXAMPLE_USER: User = {
	id: 'exampleUserId',
	name: 'exampleUserName',
	email: 'a@a.com',
	password: 'exampleUserPassword',
	phone: 'exampleUserPhone',
	image: 'exampleUserImage',
	createAt: new Date(),
	deleteAt: new Date(),
	updateAt: new Date(),
	dogs: [null],
	reservation: [null],
};

function run(callback, e) {
	return callback(e);
}
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthResolver', () => {
	let usersService: UsersService;
	let authService: AuthService;
	let mockUsersRepository: MockRepository<User>;
	let cache: Cache;
	let jwtService: JwtService;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			imports: [
				MailerModule.forRootAsync({
					useFactory: () => ({
						transport: {
							service: 'Gmail',
							host: process.env.EMAIL_HOST,
							port: Number(process.env.DATABASE_PORT),
							secure: false,
							auth: {
								user: process.env.EMAIL_USER,
								pass: process.env.EMAIL_PASS,
							},
						},
					}),
				}),
			],
			providers: [
				AuthService,
				UsersService,
				JwtService,
				{
					provide: getRepositoryToken(User),
					useClass: MockUsersRepository,
				},
				{
					provide: CACHE_MANAGER,
					useValue: {
						get: () => 'any value',
						set: () => jest.fn(),
					},
				},
			],
		}).compile();

		usersService = module.get<UsersService>(UsersService);
		authService = module.get<AuthService>(AuthService);
		cache = module.get(CACHE_MANAGER);
		mockUsersRepository = module.get(getRepositoryToken(User));
		jwtService = module.get<JwtService>(JwtService);
	});

	// <------ 여기서부터 테코 ------>
	describe('login', () => {
		const checkUser = [];
		it('브라우저에서 입력한 이메일로 유저 정보 찾아오기', async () => {
			const email = EXAMPLE_USER.email;
			const result = mockUsersRepository.findOne({ where: { email } });

			expect(usersService.findOneByEmail({ email })).toStrictEqual(result);
			checkUser.push(true);
		});

		it('찾아온 유저 정보의 비밀번호와 브라우저에서 입력된 비밀번호가 일치하지 않으면 에러던지기', () => {
			const email = EXAMPLE_USER.email;
			const user = mockUsersRepository.findOne({ where: { email: email } });
			const myPassword = EXAMPLE_USER.password;
			const dbPassword = user.password;
			try {
				myPassword !== dbPassword;
			} catch (error) {
				expect(error).toBeInstanceOf(UnprocessableEntityException);
			}
			checkUser.push(true);
		});

		it('user가 유효하므로 setrefreshToken이 실행된다', () => {
			if (checkUser[0] !== true || checkUser[1] !== true) {
				throw new UnprocessableEntityException('유효하지 않은 유저정보입니다');
			}
			const res = EXAMPLE_Res;
			const lastIdx = res.length - 1;
			// 여기에서 망했음을 느꼈고 새 파일을 판다...

			const setRefreshTokenMock = jest.fn(() =>
				res.headers.cookie.replace(
					EXAMPLE_REFRESH_TOKEN,
					EXAMPLE_REFRESH_TOKEN_NEW,
				),
			);
			setRefreshTokenMock();

			expect(setRefreshTokenMock).toHaveBeenCalled();
		});

		it('user가 유효하므로 getAccessToken 실행된다', () => {
			if (checkUser[0] !== true || checkUser[1] !== true) {
				throw new UnprocessableEntityException('유효하지 않은 유저정보입니다');
			}

			const req = EXAMPLE_Req;
			const getAccessTokenMock = jest.fn(() =>
				req.headers.authorization.replace(
					EXAMPLE_ACCESS_TOKEN,
					EXAMPLE_ACCESS_TOKEN_NEW,
				),
			);
			getAccessTokenMock();

			expect(getAccessTokenMock).toHaveBeenCalled();
		});
	});

	describe('logout', () => {
		it('req에서 액세스토큰, 리프레시토큰 가져와서 레디스에 저장', () => {
			//
			const req = EXAMPLE_Req;
			const accessToken = req.headers['authorization'].replace('Bearer ', '');
			const refreshToken = req.headers['cookie'].split('refreshToken=')[1];

			const jwtAccessKey = jest.fn(() => true);
			const jwtRefreshKey = jest.fn(() => true);

			const result1 = { accessToken, refreshToken };

			const save = () => {
				EXAMPLE_Redis.push = {
					accessToken: EXAMPLE_ACCESS_TOKEN_NEW,
					refreshToken: EXAMPLE_REFRESH_TOKEN_NEW,
				};
			};
			save();

			const result2 = {
				accessToken: EXAMPLE_ACCESS_TOKEN_NEW,
				refreshToken: EXAMPLE_REFRESH_TOKEN_NEW,
			};

			expect(result1).toEqual({
				EXAMPLE_ACCESS_TOKEN_NEW,
				EXAMPLE_REFRESH_TOKEN_NEW,
			});
			expect(result2).toEqual({
				EXAMPLE_ACCESS_TOKEN_NEW,
				EXAMPLE_REFRESH_TOKEN_NEW,
			});
		});

		it('레디스에 토큰이 저장되어 있다면 로그아웃 성공', () => {
			const final = jest.fn(() => {
				if (EXAMPLE_Redis.length === 0) {
					return '로그아웃 실패';
				} else {
					return '로그아웃 성공';
				}
			});
			const result = final();

			expect(result).toBe('로그아웃 성공');
		});
	});
});
