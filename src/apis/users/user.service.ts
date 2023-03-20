import {
	CACHE_MANAGER,
	ConflictException,
	Inject,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
	IUsersServiceCreate,
	IUsersServiceDelete,
	IUsersServiceFindOne,
	IUsersServiceFindOneByEmail,
	IUsersServiceUpdate,
} from './interface/users.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { getToday } from 'src/commons/utils/utils';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>, //

		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private readonly mailerService: MailerService,
	) {}

	// 전체 조회하기
	findAll(): Promise<User[]> {
		return this.userRepository.find({});
	}

	// 하나 조회하기
	findOne({ userId }: IUsersServiceFindOne): Promise<User> {
		return this.userRepository.findOne({
			where: { id: userId },
			relations: { dogs: true },
		});
	}

	// 중복 계정 체크를 위한 이메일 조회
	findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
		return this.userRepository.findOne({ where: { email } });
	}

	// 삭제된 유저 조회하기(삭제는 나중에)
	findAllWithDeleted(): Promise<User[]> {
		return this.userRepository.find({
			withDeleted: true,
		});
	}

	// 이메일 인증번호 전송
	async sendTokenEmail({ email }): Promise<string> {
		const EMAIL_USER = process.env.EMAIL_USER;

		const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
		// 이메일 정상인지 확인
		const isValid = this.checkValidationEmail({ email });
		if (isValid) {
			const dbEmail = await this.findOneByEmail({ email });

			if (dbEmail) {
				throw new ConflictException('이미 등록된 이메일입니다.');
			}
			// 이메일 인증번호 토큰 보내주기.
			await this.mailerService.sendMail({
				to: email,
				from: EMAIL_USER,
				subject: '인증 번호입니다.',
				html: `
				<!DOCTYPE html>
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
			const myToken = await this.cacheManager.get(email);
			if (myToken) {
				await this.cacheManager.del(email);
			}
			await this.cacheManager.set(email, token, {
				ttl: 180,
			});
			return token;
		}
	}

	// 이메일이 정상인지 확인
	checkValidationEmail({ email }) {
		if (email === undefined || email.includes('@') === false) {
			return false;
		} else {
			return true;
		}
	}

	// 회원가입
	async create({
		name, //
		email,
		password,
		phone,
	}: IUsersServiceCreate): Promise<User> {
		// 중복 계정 체크
		const user = await this.findOneByEmail({ email });
		if (user) throw new ConflictException('이미 등록된 이메일입니다!!');

		// 비밀번호 암호화해주기
		const hasedPassword = await bcrypt.hash(password, 10);

		// 이메일 가입환영 템플릿 보내주기
		await this.sendEmail({ email, name });

		// 다시 리졸버로 값을 보내준다.
		return this.userRepository.save({
			name,
			email,
			password: hasedPassword,
			phone,
		});
	}

	// 로그인한 유저와 유저 댕댕이 프로필
	async findUserDog({ email }): Promise<User> {
		const result = await this.userRepository.findOne({
			where: { email },
			// relations: {dog:true},
		});
		return result;
	}

	// 가입환영 템플릿 만들어주기
	async sendEmail({ email, name }) {
		const EMAIL_USER = process.env.EMAIL_USER;

		const mytemplate = `
    <html>
        <body>
            <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 500px;">
                <h1>${name}님 가입을 환영합니다!</h1>
                <hr />
                <div style="color: black;">이름: ${name}</div>
                <div>email: ${email}</div>
                <div>가입일: ${getToday()}</div>
            </div>
            </div>
        </body>
    </html>
		`;

		await this.mailerService
			.sendMail({
				to: email,
				from: EMAIL_USER,
				subject: 'Groomeong 가입을 환영합니다.',
				html: mytemplate,
			})
			.catch((err) => {
				throw new err();
			});
		return true;
	}
	// 회원 수정하기
	async update({
		userId, //
		updateUserInput,
	}: IUsersServiceUpdate): Promise<User> {
		const user = await this.findOne({ userId });
		console.log('🐧🐧🐧🐧🐧', user);
		console.log({ ...updateUserInput });
		const result = await this.userRepository.save({
			...user,
			...updateUserInput,
		});
		return result;
	}

	// 유저 삭제하기(삭제는 나중에)
	async delete({
		userId, //
	}: IUsersServiceDelete) {
		console.log('🚫🚫🚫🚫', { id: userId });
		const result = await this.userRepository.softDelete({ id: userId });
		return result.affected ? true : false;
	}

	// 인풋박스 인증번호 검증
	async checkToken({ email, token }) {
		const myToken = await this.cacheManager.get(email);
		return myToken === token ? true : false;
		// if (myToken === token) {
		// 	return true;
		// } else {
		// 	throw new UnprocessableEntityException('토큰이 잘못되었습니다');
		// }
	}
}
