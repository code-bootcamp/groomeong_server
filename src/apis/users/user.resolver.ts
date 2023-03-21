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

	// 전체 조회하기
	@Query(() => [User], { description: ' Return: 전체 유저 정보 ' })
	fetchUsers(): Promise<User[]> {
		return this.usersService.findAll();
	}

	// 하나 조회하기
	@Query(() => User, { description: ' Return:  유저 정보 ' })
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

	// 로그인 된 유저 조회하기 (마이페이지가 들어가기 위함)
	@UseGuards(GqlAuthGuard('access'))
	@Query(() => User, {
		description: ' Return : 로그인한 유저, 유저 댕댕이 프로필',
	})
	fetchLoginUser(
		@Context() context: IContext, //
	): Promise<User> {
		console.log('🐼🐼🐼🐼🐼🐼🐼🐼');
		// console.log(context.req.user);
		// console.log(context.req.user.email);
		console.log('🐼🐼🐼🐼🐼🐼🐼🐼');

		return this.usersService.findUserDog({ email: context.req.user.email });
	}

	// 회원가입
	@Mutation(() => User, { description: ' Return: 유저 회원가입 ' })
	createUser(
		@Args('name') name: string,
		@Args('email') email: string,
		@Args('password') password: string,
		@Args('phone') phone: string,
		// @Args('image') image: string,
	): Promise<User> {
		return this.usersService.create({
			name, //
			email,
			password,
			phone,
			// image,
		});
	}

	// 회원 수정하기
	@Mutation(() => User, { description: ' Return: 회원정보 업데이트 ' })
	updateUser(
		@Args('userId') userId: string,
		@Args('updateUserInput') updateUserInput: UpdateUserInput,
	): Promise<User> {
		console.log('🦊🦊🦊');
		return this.usersService.update({ userId, updateUserInput });
	}

	// 회원가입 시 이메일 인증번호 전송
	@Mutation(() => String, { description: '회원가입 시 이메일 인증번호 전송' })
	getTokenEmail(
		@Args('email') email: string, //
	): Promise<string> {
		return this.usersService.sendTokenEmail({ email });
	}

	// 인풋박스 인증번호 검증
	@Mutation(() => Boolean, { description: '인증번호 검증' })
	checkValidToken(
		@Args('email') email: string, //
		@Args('token') token: string,
	): Promise<boolean> {
		return this.usersService.checkToken({ email, token });
	}

	// 유저 삭제하기
	@Mutation(() => Boolean, { description: ' Return: 유저 정보 삭제하기 ' })
	deleteUser(
		@Args('userId') userId: string, //
	): Promise<boolean> {
		return this.usersService.delete({ userId });
	}
}
