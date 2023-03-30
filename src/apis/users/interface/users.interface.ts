import { UpdateUserInput } from '../dto/update-users.input';

export interface IUsersServiceFindOne {
	userId: string;
	email?: string;
}

export interface IUsersServiceCreate {
	name: string;
	email: string;
	password?: string;
	phone?: string;
	image?: string;
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

export interface IUsersServiceSendTokenEmail {
	email: string;
}

export interface IUsersServiceCheckValidationEmail {
	email: string;
}

export interface IUsersServiceFindUserDog {
	email: string;
}

export interface IUsersServiceSendEmail {
	email: string;
	name: string;
}

export interface IUsersServiceCheckToken {
	email: string;
	token: string;
}

export interface IUsersServiceDuplicationEmail {
	email: string;
}

export interface IUsersServiceUpdatePwd {
	userId: string;
	updateUserInput: UpdateUserInput;
}

export interface IUsersServiceResetPassword {
	email: string;
	newPassword: string;
}
