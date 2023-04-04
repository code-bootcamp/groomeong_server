import {
	CACHE_MANAGER,
	ConflictException,
	Inject,
	Injectable,
	NotFoundException,
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
	IUsersServiceDuplicationEmail,
	IUsersServiceFindOne,
	IUsersServiceFindOneByEmail,
	IUsersServiceFindUserDog,
	IUsersServiceResetPassword,
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

	async findAll(): Promise<User[]> {
		return await this.userRepository.find({});
	}

	async findOne({ userId }: IUsersServiceFindOne): Promise<User> {
		const myUser = await this.userRepository.findOne({
			where: { id: userId },
			relations: { reservation: true },
		});
		if (!myUser) {
			throw new NotFoundException(`ID가 ${userId}인 회원을 찾을 수 없습니다`);
		}
		return myUser;
	}

	findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
		return this.userRepository.findOne({ where: { email } });
	}

	findAllWithDeleted(): Promise<User[]> {
		return this.userRepository.find({
			withDeleted: true,
		});
	}

	async sendTokenEmail({
		email,
	}: IUsersServiceSendTokenEmail): Promise<string> {
		const token = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

		this.checkValidationEmail({ email });

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

	async duplicationEmail({
		email,
	}: IUsersServiceDuplicationEmail): Promise<boolean> {
		const user = await this.findOneByEmail({ email });
		if (user) {
			throw new ConflictException('이미 등록된 이메일입니다!!');
		} else {
			return true;
		}
	}

	async create({
		name, //
		email,
		password,
		phone,
	}: IUsersServiceCreate): Promise<User> {
		await this.checkValidationEmail({ email });

		const hasedPassword = await bcrypt.hash(password, 10);

		await this.sendEmail({ email, name });

		return this.userRepository.save({
			name,
			email,
			password: hasedPassword,
			phone,
		});
	}

	async findUserDog({ email }: IUsersServiceFindUserDog): Promise<User> {
		const result = await this.userRepository.findOne({
			where: { email },
		});
		return result;
	}

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

	async update({
		userId, //
		updateUserInput,
	}: IUsersServiceUpdate): Promise<User> {
		const user = await this.findOne({ userId });

		if (updateUserInput.password) {
			updateUserInput.password = await bcrypt.hash(
				updateUserInput.password,
				10,
			);
		}
		const result = await this.userRepository.save({
			...user,
			...updateUserInput,
		});
		return result;
	}

	async resetPassword({
		email,
		newPassword,
	}: IUsersServiceResetPassword): Promise<User> {
		const theUser = await this.userRepository.findOne({
			where: { email },
		});

		theUser.password = await bcrypt.hash(newPassword, 10);

		return await this.userRepository.save(theUser);
	}

	async delete({
		userId, //
	}: IUsersServiceDelete) {
		const result = await this.userRepository.softDelete({ id: userId });
		return result.affected ? true : false;
	}

	async checkToken({ email, token }: IUsersServiceCheckToken) {
		const myToken = await this.cacheManager.get(email);
		return myToken === token ? true : false;
	}
}
