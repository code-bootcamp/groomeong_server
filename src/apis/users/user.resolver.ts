import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserInput } from './dto/update-users.input';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
	constructor(
		private readonly usersService: UsersService, //
	) {}

	// 전체 조회하기
	@Query(() => [User])
	fetchUsers(): Promise<User[]> {
		return this.usersService.findAll();
	}

	// 하나 조회하기
	@Query(() => User)
	fetchUser(
		@Args('userId') userId: string, //
	): Promise<User> {
		return this.usersService.findOne({ userId });
	}

	// 삭제된 유저 조회하기
	@Query(() => [User])
	fetchUserWithDeleted(): Promise<User[]> {
		return this.usersService.findAllWithDeleted();
	}
	// 회원가입
	@Mutation(() => User)
	createUser(
		@Args('name') name: string,
		@Args('email') email: string,
		@Args('password') password: string,
		@Args('phone') phone: string,
	): Promise<User> {
		return this.usersService.create({
			name, //
			email,
			password,
			phone,
		});
	}

	// 회원 수정하기
	@Mutation(() => User)
	updateUser(
		@Args('userId') userId: string,
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
	): Promise<User> {
		console.log('🦊🦊🦊');
		return this.usersService.update({ userId, updateUserInput });
	}

	// 비밀번호 수정하기
	// Auth 생성후 하기

	// 로그인
	// Auth 생성후 후기

	// 유저 삭제하기
	@Mutation(() => Boolean)
	deleteUser(
		@Args('userId') userId: string, //
	): Promise<boolean> {
		return this.usersService.delete({ userId });
	}
}
