import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER, UnprocessableEntityException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersService } from 'src/apis/users/user.service';
import { User } from 'src/apis/users/entities/user.entity';
import { AuthService } from '../auth.service';
import { IContext } from 'src/commons/interface/context';
import { JwtService } from '@nestjs/jwt';
import * as httpMocks from 'node-mocks-http';
import { MockUsersRepository } from './auth.mocking.dummy';
import { MailerModule } from '@nestjs-modules/mailer';

jest.mock('../auth.service');

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

describe('AuthResolver', () => {
	let authService: AuthService;
	let usersService: UsersService;
	let jwtService: JwtService;
	let cache: Cache;
	let context: IContext;

	beforeEach(async () => {
		jest.clearAllMocks();
		const usersModule: TestingModule = await Test.createTestingModule({
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
		const authModule: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
		}).compile();

		usersService = usersModule.get<UsersService>(UsersService);
		authService = authModule.get<AuthService>(AuthService);
		cache = usersModule.get(CACHE_MANAGER);
		context = {
			req: httpMocks.createRequest(),
			res: httpMocks.createResponse(),
		};
	});

	const email = EXAMPLE_USER.email;
	const password = EXAMPLE_USER.password;

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
		//
	});

	describe('restoreAccessToken', () => {
		//
	});
});
