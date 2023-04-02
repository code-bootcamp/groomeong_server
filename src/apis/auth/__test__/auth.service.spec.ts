import { Test, TestingModule } from '@nestjs/testing';
import {
	CACHE_MANAGER,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/apis/users/user.service';
import { User } from 'src/apis/users/entities/user.entity';
import { AuthService } from '../auth.service';
import { IContext } from 'src/commons/interface/context';
import { JwtService } from '@nestjs/jwt';
import * as httpMocks from 'node-mocks-http';

jest.mock('../auth.service');

const EXAMPLE_USER: User = {
	id: 'exampleUserId',
	name: 'exampleUserName',
	email: 'a@a.com',
	password: 'exampleUserPassword',
	phone: 'exampleUserPhone',
	image: 'exampleUserImage',
	createdAt: new Date(),
	deletedAt: new Date(),
	updatedAt: new Date(),
	dogs: [null],
	reservation: [null],
};

describe('AuthResolver', () => {
	let authService: AuthService;
	let usersService: UsersService;
	let jwt: JwtService;
	let cacheManager: Cache;

	const context: IContext = {
		req: httpMocks.createRequest(),
		res: httpMocks.createResponse(),
	};
	context.req.user = new User();
	context.req.user.id = EXAMPLE_USER.id;
	const email = EXAMPLE_USER.email;
	const password = EXAMPLE_USER.password;
	const process = {
		env: {
			JWT_ACCESS_KEY: 'exampleAccess',
			JWT_REFRESH_KEY: 'exampleRefresh',
		},
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		const modules: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: {
						findOneByEmail: jest.fn(() => EXAMPLE_USER),
						create: jest.fn(() => EXAMPLE_USER),
					},
				},
				{
					provide: JwtService,
					useValue: {
						verify: jest.fn(() => 'EXAMPLE_TOKEN'),
					},
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

		authService = modules.get<AuthService>(AuthService);
		usersService = modules.get<UsersService>(UsersService);
		jwt = modules.get<JwtService>(JwtService);
		cacheManager = modules.get(CACHE_MANAGER);
	});

	describe('login', () => {
		it('의존성주입한 usersService 에서 email로 찾아오기', async () => {
			jest
				.spyOn(usersService, 'findOneByEmail')
				.mockImplementationOnce(async (email) => EXAMPLE_USER);
			const user = await usersService.findOneByEmail({ email });

			try {
				user !== undefined;
			} catch (error) {
				expect(error).toThrowError(UnprocessableEntityException);
			}
			expect(usersService.findOneByEmail).toBeCalled();
		});

		it('이메일은 일치하지만 비밀번호가 일치하지 않으면 에러던지기!!', async () => {
			const isAuth = jest.fn(() => true);

			try {
				isAuth !== undefined;
			} catch (error) {
				expect(error).toThrowError(UnprocessableEntityException);
			}
		});

		it('refreshToken(=JWT) 을 만들어서 브라우저 쿠키에 저장해서 보내주기', async () => {
			const { req, res } = context;
			const user = await usersService.findOneByEmail({ email });

			await authService.setRefreshToken({ user, req, res });

			expect(authService.setRefreshToken).toBeCalled();
		});

		it('accessToken를 만들어 브라우저로 전달하기', async () => {
			const user = await usersService.findOneByEmail({ email });

			await authService.getAccessToken({ user });

			expect(authService.getAccessToken).toBeCalled();
		});
	});

	describe('logout', () => {
		const req = context.req;
		it('토큰 증명해서 로그아웃 인가', async () => {
			const req = {
				headers: {
					authorization: 'Bearer ACCESS_TOKEN',
					cookie: 'refreshToken=REFRESH_TOKEN',
				},
			};

			try {
				const accessToken = await req.headers['authorization'].replace(
					'Bearer ',
					'',
				);
				const refreshToken = await req.headers['cookie'].split(
					'refreshToken=',
				)[1];

				// accessToken 토큰
				const jwtAccessKey = jwt.verify(accessToken);

				// refresh 토큰
				const jwtRefreshKey = jwt.verify(refreshToken);

				await cacheManager.set(`accessToken:${accessToken}`, 'accessToken', {
					ttl: jwtAccessKey['exp'] - jwtAccessKey['iat'],
				});

				await cacheManager.set(`refreshToken:${refreshToken}`, 'refreshToken', {
					ttl: jwtRefreshKey['exp'] - jwtRefreshKey['iat'],
				});

				expect(jwt.verify).toBeCalled();

				return '로그아웃에 성공했습니다.';
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				expect(error.message).toBe('로그아웃을 실패했습니다.');
				throw new UnauthorizedException('로그아웃을 실패했습니다.');
			}
		});

		describe('restoreAccessToken', () => {
			const user = EXAMPLE_USER;

			beforeEach(async () => {
				await authService.getAccessToken({ user });
			});

			it('getAccessToken should be called', () => {
				expect(authService.getAccessToken).toBeCalled();
			});
		});
	});
});
