import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IContext } from 'src/commons/interface/context';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { UpdateUserInput } from './dto/update-users.input';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Resolver()
export class UsersResolver {
	constructor(
		private readonly usersService: UsersService, //
	) {}

	@Query(() => [User], { description: ' Return: 전체 유저 정보 ' })
	fetchUsers(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@Query(() => User, { description: ' Return:  유저 정보 ' })
	fetchUser(
		@Args('userId') userId: string, //
	): Promise<User> {
		return this.usersService.findOne({ userId });
	}

	@Query(() => [User])
	fetchUserWithDeleted(): Promise<User[]> {
		return this.usersService.findAllWithDeleted();
	}

	@Query(() => Boolean, { description: ' Return: 중복 계정 확인하기 ' })
	duplicateEmail(
		@Args('email') email: string, //
	): Promise<boolean> {
		return this.usersService.duplicationEmail({ email });
	}

	@UseGuards(GqlAuthGuard('access'))
	@Query(() => User, {
		description: ' Return : 로그인한 유저, 유저 댕댕이 프로필',
	})
	fetchLoginUser(
		@Context() context: IContext, //
	): Promise<User> {
		return this.usersService.findUserDog({ email: context.req.user.email });
	}

	@Mutation(() => User, { description: ' Return: 유저 회원가입 ' })
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

	@UseGuards(GqlAuthGuard('access'))
	@Mutation(() => User, { description: ' Return: 회원정보 업데이트 ' })
	updateUser(
		@Args('userId') userId: string,
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
	): Promise<User> {
		console.log('🦊🦊🦊');
		return this.usersService.update({ userId, updateUserInput });
	}

	@Mutation(() => User, { description: 'Return: 비밀번호 초기화하기(찾기)' })
	resetPwd(
		@Args('email') email: string, //
		@Args('newPassword') newPassword: string,
	): Promise<User> {
		return this.usersService.resetPassword({ email, newPassword });
	}

	@Mutation(() => String, { description: ' Return: 이메일 인증번호 전송 ' })
	getTokenEmail(
		@Args('email') email: string, //
	): Promise<string> {
		return this.usersService.sendTokenEmail({ email });
	}

	@Mutation(() => Boolean, { description: 'Return: 인증번호 검증' })
	checkValidToken(
		@Args('email') email: string, //
		@Args('token') token: string,
	): Promise<boolean> {
		return this.usersService.checkToken({ email, token });
	}

	@Mutation(() => Boolean, { description: ' Return: 유저 정보 삭제하기 ' })
	deleteUser(
		@Args('userId') userId: string, //
	): Promise<boolean> {
		return this.usersService.delete({ userId });
	}
}
