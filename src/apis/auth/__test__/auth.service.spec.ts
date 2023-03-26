import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockUsersRepository } from './auth.mocking.dummy';
import { CACHE_MANAGER, UnprocessableEntityException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { UsersService } from 'src/apis/users/user.service';
import { User } from 'src/apis/users/entities/user.entity';

const EXAMPLE_ACCESS_TOKEN = 'exampleAccessToken';
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

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthResolver', () => {
	let usersService: UsersService;
	let mockUsersRepository: MockRepository<User>;
	let cache: Cache;

	beforeEach(async () => {
		const usersModule = await Test.createTestingModule({
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

		cache = usersModule.get(CACHE_MANAGER);
		usersService = usersModule.get<UsersService>(UsersService);
		mockUsersRepository = usersModule.get(getRepositoryToken(User));
	});

	describe('login', async () => {
		it('브라우저에서 입력한 이메일로 유저 정보 찾아오기', () => {
			const email = EXAMPLE_USER.email;
			const result = mockUsersRepository.findOne({ where: { email } });

			expect(usersService.findOneByEmail({ email })).toStrictEqual(result);
		});

		it(
			'찾아온 유저 정보의 비밀번호와 브라우저에서 입력된 비밀번호가 일치하지 않으면 에러던지기',
		),
			() => {
				const myPassword = EXAMPLE_USER.email;
				const dbpassword = mockUsersRepository.findOne({ where: { email } });
				try {
					//
				} catch (error) {
					expect(error).toBeInstanceOf(UnprocessableEntityException);
				}
			};

		// it(
		// 	'일치하는 유저가 있고 비밀번호도 맞았다면? accessToken 를 => JWT 만들어서 브라우저에 전달',
		// ),
		// 	() => {
		//     expect(). //JWT 리턴하려면 어떤 메서드를 사용?
		// 	};
	});

	describe('logout', () => {});

	describe('restoreAccessToken', () => {});
});
