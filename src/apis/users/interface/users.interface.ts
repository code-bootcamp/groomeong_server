import { UpdateUserInput } from '../dto/update-users.input';

export interface IUsersServiceFindOne {
	userId: string;
	email?: string;
}

export interface IUsersServiceCreate {
	name: string;
	email: string;
	password: string;
	phone: string;
}

export interface IUsersServiceFindOneByEmail {
	email: string;
}

export interface IUsersServiceUpdate {
	userId: string;
	updateUserInput: UpdateUserInput;
}

export interface IUsersServiceDelete {
	userId: string;
}
