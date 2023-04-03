import { CreateDogInput } from '../dto/create-dog.input';

export interface IDogsServiceFindOneById {
	id: string;
}

export interface IDogsServiceFindByUserId {
	userId: string;
}

export interface IDogsServiceCreate {
	createDogInput: CreateDogInput;
	userId: string;
}

export interface IDogsServiceDeleteById {
	id: string;
	userId: string;
}
