import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser, IContext } from 'src/commons/interface/context';

export interface IAuthServiceGetAccessToken {
	user: User | IAuthUser['user'];
}

export interface IAuthServiceLogin {
	email: string;
	password: string;
	req: IContext['req'];
	res: IContext['res'];
}
