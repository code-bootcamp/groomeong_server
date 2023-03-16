import { ConflictException, Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>, //
	) {}

	// 전체 조회하기
	findAll(): Promise<User[]> {
		return this.userRepository.find({});
	}

	// 하나 조회하기
	findOne({ userId }: IUsersServiceFindOne): Promise<User> {
		return this.userRepository.findOne({
			where: { id: userId },
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

	// restore() (삭제는 나중에)
}
