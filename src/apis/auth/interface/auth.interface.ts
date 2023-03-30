import { Request, Response } from 'express';
import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser, IContext } from 'src/commons/interface/context';

export interface IAuthServiceGetAccessToken {
	user: User | IAuthUser['user'];
}

export interface IAuthServiceLogin {
	email: string;
	password: string;
	req?: IContext['req'];
	res?: IContext['res'];
}

export interface IAuthServiceSetRefreshToken {
	user: User;
	req?: Request;
	res: Response;
}

export interface IAuthServiceRestoreAccessToken {
	user: IAuthUser['user'];
}

export interface IOAuthLoginUser {
	// 이 로직을 쓰게 된다면 카카오 이메일을 못 불러오므로 아래 로직 작성 !
	// user: Pick<User, 'name' | 'email' | 'phone' | 'password'>;
	user: {
		name: string;
		email: string;
		password?: string;
		phone?: string;
	};
}

export interface ILoginService {
	req: Request & IOAuthLoginUser; //
	res: Response;
}

export interface IAuthServiceLogOut {
	req: IContext['req'];
	res: IContext['res'];
}
