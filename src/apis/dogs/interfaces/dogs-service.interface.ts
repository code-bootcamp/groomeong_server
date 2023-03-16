import { CreateDogInput } from '../dto/create-dog.input';

export interface IDogsServiceFindOneById {
	id: string;
}

export interface IDogsServiceCreate {
	createDogInput: CreateDogInput;
}

export interface IDogsServiceDeleteById {
	id: string;
}
