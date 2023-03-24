import { MailerModule } from '@nestjs-modules/mailer';
import { CACHE_MANAGER, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { UsersService } from 'src/apis/users/user.service';
import { Repository } from 'typeorm';
import { AuthService } from '../auth.service';
import { MockUsersRepository } from './auth.mocking.dummy';

const EXAMPLE_ACCESS_TOKEN = 'exampleAccessToken';
const EXAMPLE_REFRESH_TOKEN = 'exampleRefreshToken';
const EXAMPLE_JWT_REFRESH_KEY = 'exampleRefreshKey';
const EXAMPLE_AUTH = true;
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
			const req = 'exampleReq';
			const res = 'exampleRes';
			const setRefreshTokenMock = jest.fn();
			run(setRefreshTokenMock, { EXAMPLE_USER, req, res });

			expect(setRefreshTokenMock).toHaveBeenCalled();
		});

		it('user가 유효하므로 getAccessToken 실행된다', () => {
			if (checkUser[0] !== true || checkUser[1] !== true) {
				throw new UnprocessableEntityException('유효하지 않은 유저정보입니다');
			}
			const user = EXAMPLE_USER;
			const req = 'exampleReq';
			const res = 'exampleRes';
			const getAccessTokenMock = jest.fn();
			getAccessTokenMock.mockReturnValue(EXAMPLE_ACCESS_TOKEN);
			const result = run(getAccessTokenMock, { user });

			expect(getAccessTokenMock).toHaveBeenCalled();
			expect(result).toEqual(EXAMPLE_ACCESS_TOKEN);
		});
	});

	describe('logout', () => {
		it('', async () => {
			//
		});
	});
});
