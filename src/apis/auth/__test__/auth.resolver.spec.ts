import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import * as httpMocks from 'node-mocks-http';
import { CanActivate } from '@nestjs/common';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { IContext } from 'src/commons/interface/context';

jest.mock('../auth.service');

const Example_user = {
	id: '3e3f6340-1164-4b5b-a2fd-e067f180f59f',
	name: 'name1',
	email: 'a@a.com',
	password: '$2b$10$vQ5ylnvTEafMPbiFg0d2.uTudcTLspBsLzD/kKGHIhgZhAo0QxtBi',
	phone: '01011112222',
	image: null,
	createAt: '2023-03-22 12:54:33.782589',
	deleteAt: null,
	updateAt: '2023-03-22 12:54:33.782589',
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
				email: Example_user.email,
				password: Example_user.password,
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
