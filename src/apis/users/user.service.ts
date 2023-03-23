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
	IUsersServiceCheckToken,
	IUsersServiceCheckValidationEmail,
	IUsersServiceCreate,
	IUsersServiceDelete,
	IUsersServiceFindOne,
	IUsersServiceFindOneByEmail,
	IUsersServiceFindUserDog,
	IUsersServiceSendEmail,
	IUsersServiceSendTokenEmail,
	IUsersServiceUpdate,
} from './interface/users.interface';
import { MailerService } from '@nestjs-modules/mailer';
import { sendTokenTemplate, welcomeTemplate } from 'src/commons/utils/utils';

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
	async findAll(): Promise<User[]> {
		return await this.userRepository.find({});
	}

	// 하나 조회하기
	async findOne({ userId }: IUsersServiceFindOne): Promise<User> {
		return await this.userRepository.findOne({
			where: { id: userId },
			relations: { reservation: true },
		});
	}

	// 중복 계정 체크를 위한 이메일 조회
	findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
		return this.userRepository.findOne({ where: { email } });
	}

	// 삭제된 유저 조회하기
	findAllWithDeleted(): Promise<User[]> {
		return this.userRepository.find({
			withDeleted: true,
		});
	}

	// 이메일 인증번호 전송
	async sendTokenEmail({
		email,
	}: IUsersServiceSendTokenEmail): Promise<string> {
		const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
		// 이메일 정상인지 확인
		this.checkValidationEmail({ email });
		console.log(token);
		// 이메일 인증번호 토큰 보내주기.
		await this.mailerService.sendMail({
			to: email,
			from: process.env.EMAIL_USER,
			subject: '인증 번호입니다.',
			html: sendTokenTemplate({ token }),
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

	// 이메일이 정상인지 확인
	checkValidationEmail({ email }: IUsersServiceCheckValidationEmail) {
		if (
			email === undefined ||
			email.includes('@') === false ||
			email.split('@')[0].length >= 20
		) {
			throw new UnprocessableEntityException('형식이 올바르지 않습니다!');
		} else {
			return true;
		}
	}

	// 중복검사 ============>>> 이거부터 다시 시작 <<================
	async duplicationEmail({ email }) {
		const user = await this.findOneByEmail({ email });
		if (user) {
			throw new ConflictException('이미 등록된 이메일입니다!!');
		}
	}

	// 회원가입
	async create({
		name, //
		email,
		password,
		phone,
	}: // image,
	IUsersServiceCreate): Promise<User> {
		//이메일 정상인지 확인
		await this.checkValidationEmail({ email });

		// 중복 계정 체크
		await this.duplicationEmail({ email });
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
			// image,
		});
	}

	// 로그인한 유저와 유저 댕댕이 프로필
	async findUserDog({ email }: IUsersServiceFindUserDog): Promise<User> {
		const result = await this.userRepository.findOne({
			where: { email },
			// relations: {dog:true},
		});
		return result;
	}

	// 가입환영 템플릿 만들어주기
	async sendEmail({ email, name }: IUsersServiceSendEmail) {
		const EMAIL_USER = process.env.EMAIL_USER;

		const mytemplate = welcomeTemplate({ email, name });

		await this.mailerService
			.sendMail({
				to: email,
				from: EMAIL_USER,
				subject: 'Groomeong 가입을 환영합니다.',
				html: mytemplate,
			})
			.catch((err) => {
				throw new UnprocessableEntityException('연결이 원할하지 않습니다!');
			});
		return true;
	}
	// 회원 수정하기
	async update({
		userId, //
		updateUserInput,
	}: IUsersServiceUpdate): Promise<User> {
		const user = await this.findOne({ userId });
		const result = await this.userRepository.save({
			...user,
			...updateUserInput,
		});
		return result;
	}

	// 이메일 인증 후 비밀번호 수정
	// updatePwdSendToken({ email, password }) {}

	// 유저 삭제하기(삭제는 나중에)
	async delete({
		userId, //
	}: IUsersServiceDelete) {
		const result = await this.userRepository.softDelete({ id: userId });
		return result.affected ? true : false;
	}

	// 이메일 인증번호 검증
	async checkToken({ email, token }: IUsersServiceCheckToken) {
		const myToken = await this.cacheManager.get(email);
		return myToken === token ? true : false;
	}
}
