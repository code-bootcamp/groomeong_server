import { MailerModule } from '@nestjs-modules/mailer';
import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { UsersService } from 'src/apis/users/user.service';
import { Repository } from 'typeorm';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { MockUsersRepository } from './auth.mocking.dummy';

const EXAMPLE_AUTH = {
	token: EXAMPLE_TOKEN,
};
const EXAMPLE_ACCESS_TOKEN = 'exampleAccessToken';
const EXAMPLE_REFRESH_TOKEN = 'exampleRefreshToken';
// const EXAMPLE_ACCESS_TOKEN_NEW = 'new-exampleAccessToken';
// const EXAMPLE_REFRESH_TOKEN_NEW = 'new-exampleRefreshToken';
const EXAMPLE_USER_INPUT = {
	email: 'a@a.com',
	password: 'password1',
};
const EXAMPLE_Req = {
	headers: {
		authorization: `Bearer exampleAccessToken`,
		cookie: `refreshToken=exampleRefreshToken`,
	},
};
const EXAMPLE_Res = {
	headers: {
		cookie: `refreshToken=exampleRefreshToken}`,
	},
};

const authServiceLoginMock = jest.fn(() => EXAMPLE_ACCESS_TOKEN);
const authServiceLogoutMock = jest.fn(() => console.log('로그아웃에 성공!!'));
const authServiceRestoreAccessToken = jest.fn(() => EXAMPLE_ACCESS_TOKEN);
const authServiceGetAccessToken = jest.fn(() => EXAMPLE_ACCESS_TOKEN);
const authServiceSetRefreshToken = jest.fn(() => EXAMPLE_REFRESH_TOKEN);
const authServiceLoginOAuth = jest.fn(() => console.log('로그인 화면 전송!!'));

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthResolver', () => {
	let authService: AuthService;
	let usersService: UsersService;
	let mockUsersRepository: MockUsersRepository;
	let cache: Cache;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
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
				AuthResolver,
				{
					provide: AuthService,
					useClass: jest.fn(() => ({
						//
						login: authServiceLoginMock,
						logout: authServiceLogoutMock,
						restoreAccessToken: authServiceRestoreAccessToken,
						getAccessToken: authServiceGetAccessToken,
						setRefreshToken: authServiceSetRefreshToken,
						loginOAuth: authServiceLoginOAuth,
					})),
				},
				UsersService,
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

		cache = module.get(CACHE_MANAGER);
		authService = module.get<AuthService>(AuthService);
		usersService = module.get<UsersService>(UsersService);
		mockUsersRepository = module.get(getRepositoryToken(User));
	});

	describe('login', async () => {
		it('accessToken(JWT) 리턴', async () => {
			const email = EXAMPLE_USER_INPUT.email;
			const user = await usersService.findOneByEmail({ email });

			expect().toEqual(user);
		});
	});
});
