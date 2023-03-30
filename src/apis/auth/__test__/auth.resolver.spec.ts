import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import * as httpMocks from 'node-mocks-http';
import { CanActivate } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { IContext } from 'src/commons/interface/context';
import { User } from 'src/apis/users/entities/user.entity';

jest.mock('../auth.service');

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

describe('AuthResolver', () => {
	let authService: AuthService;
	let context: IContext;

	beforeEach(async () => {
		const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
		const authModule: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
		})
			.overrideGuard(GqlAuthGuard)
			.useValue(mockAuthGuard)
			.compile();
		authService = authModule.get<AuthService>(AuthService);
		context = {
			req: httpMocks.createRequest(),
			res: httpMocks.createResponse(),
		};
	});

	describe('login', () => {
		it('login 함수 실행', async () => {
			await authService.login({
				email: EXAMPLE_USER.email,
				password: EXAMPLE_USER.password,
				req: context.req,
				res: context.res,
			});

			expect(authService.login).toBeCalled();
		});
	});

	describe('logout', () => {
		it('logout 함수 실행', async () => {
			await authService.logout({
				req: httpMocks.createRequest(),
				res: httpMocks.createResponse(),
			});

			expect(authService.logout).toBeCalled();
		});
	});

	describe('restoreAccessToken', () => {
		it('restoreAccessToken 함수 실행', async () => {
			await authService.restoreAccessToken({ user: context.req.user });

			expect(authService.restoreAccessToken).toBeCalled();
		});
	});
});
