import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import {
	CacheModule,
	CACHE_MANAGER,
	ConflictException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../user.service';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

// 나만의 미니 TypeORM 만들기
class MockUsersRepository {
	mydb = [
		{ email: 'a@a.com', password: '0000', name: '짱구', phone: '01022221234' },
		{
			email: 'qqq@qqq.com',
			password: '1234',
			name: '철수',
			phone: '01012341234',
		},
	];

	findOne({ where }) {
		const users = this.mydb.filter((el) => el.email === where.email);
		if (users.length) return users[0];
		return null;
	}

	save({ email, password, name, phone }) {
		this.mydb.push({ email, password, name, phone });
		return { email, password, name, phone };
	}
}

// class MockMailerRepositry {
// 	mydbemail;
// }

describe('UsersService', () => {
	let usersService: UsersService;
	let mailerService: MailerService;
	let cacheManager: Cache;
	let userRepository: Repository<User>;

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
				CacheModule.register({}),
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
						del: jest.fn(),
					},
				},
				{
					provide: MailerService,
					useValue: {
						sendMail: jest.fn(),
					},
				},
			],
		}).compile();

		mailerService = usersModule.get<MailerService>(MailerService);
		usersService = usersModule.get<UsersService>(UsersService);
		userRepository = usersModule.get<Repository<User>>(
			getRepositoryToken(User),
		);
	});

	describe('create', () => {
		it('이미 존재하는 이메일 검증하기!!', async () => {
			const myData = {
				email: 'a@a.com',
				password: '1234',
				name: '철수',
				age: 13,
			};

			try {
				await usersService.create({ ...myData });
			} catch (error) {
				expect(error).toBeInstanceOf(ConflictException);
				// expect(error).toBeInstanceOf(UnprocessableEntityException); // 잘 만들었는지 확인하는 방법(일부러 에러 유도)
			}
		});

		it('회원 등록 잘 됐는지 검증!!', async () => {
			const myData = {
				name: '철수',
				email: 'bbb@bbb.com',
				password: '1234',
				phone: '01012341234',
			};

			const result = await userRepository.save({ ...myData });

			expect(result).toStrictEqual({
				name: '철수',
				email: 'bbb@bbb.com',
				password: '1234',
				phone: '01012341234',
			});
		});
	});

	// TDD => 테스트 먼저 만들자!!
	it('이메일 길이가 초과됏을때 검증!!', async () => {
		const myData = {
			name: '철수',
			email: ' bbadsadadwadawdawdddaw@bbb.com',
			password: '1234',
			phone: '01012341234',
		};

		try {
			await usersService.checkValidationEmail({
				email: myData.email,
			});
		} catch (e) {
			expect(e).toBeInstanceOf(UnprocessableEntityException);
		}
	});

	describe('mailerService', () => {
		it('send mail', async () => {
			const shoot = await mailerService.sendMail({
				to: '273hur4747@gmail.com',
				from: 'Test email',
				subject: '테스트코드 너무 어렵다..',
				text: 'Welcome to Hell',
			});
			expect(shoot).toBeTruthy();
		});

		it('sendTokenEmail', async () => {
			const myData = {
				name: '철수',
				email: 'bbb@bbb.com',
				password: '1234',
				phone: '01012341234',
			};

			const token = String(Math.floor(Math.random() * 1000000)).padStart(
				6,
				'0',
			);
			try {
				await usersService.sendTokenEmail({ email: myData.email });
				{
					mailerService.sendMail({
						to: '273hur4747@gmail.com',
						from: 'Test email',
						subject: '테스트코드 너무 어렵다..',
						html: `	<!DOCTYPE html>
						<html lang="ko">
							<head>
								<title>Groomeong</title>
							</head>
							<body id="box1"></body>
								<table style="width: 100%;">
										<tbody>
												<tr>
														<td style="text-align: center;">
																<h1>GROOMEONG</h1>
														</td>
												</tr>
												<tr>
														<td style="text-align: center;">
																<h2>[그루멍]인증번호를 안내해드립니다.</h2>
														</td>
												</tr>
												<tr>
														<td style="text-align: center;">
																<div id="box2">
																		<div style="font-size: 32px; color: #ABABAB; width: 100%;"> 인증번호: ${token}</div>
																</div>
														</td>
												</tr>
										</tbody>
								</table>
							</body>
						</html>		
						`,
					});
				}
			} catch (e) {
				expect(e).toBeInstanceOf(UnprocessableEntityException);
			}
		});
	});
});
