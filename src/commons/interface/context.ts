import { Request, Response } from 'express';

export interface IContext {
	req: Request & IAuthUser;
	res: Response;
}

export interface IAuthUser {
	user?: {
		id?: string;
		email?: string;
	};
}
