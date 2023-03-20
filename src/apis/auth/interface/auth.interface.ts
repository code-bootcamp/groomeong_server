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
	user: Pick<User, 'name' | 'email' | 'phone' | 'password'>;
}

export interface ILoginService {
	req: Request & IOAuthLoginUser; //
	res: Response;
}
