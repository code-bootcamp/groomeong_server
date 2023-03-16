import { CreateShopInput } from '../dto/create-shop.input';
import { UpdateShopInput } from '../dto/update-shop.input';

export interface IShopsServiceCreate {
	address: string;
	createShopInput: CreateShopInput;
}

export interface IShopsServiceFindById {
	shopId: string;
}

export interface IShopsServiceFindByPhone {
	phone: string;
}

export interface IShopsServiceFindByAddress {
	address: string;
}

export interface IShopsServiceFindDeleted {
	shopId: string;
}

export interface IShopsServiceUpdate {
	shopId: string;
	updateShopInput: UpdateShopInput;
}

export interface IShopsServiceDelete {
	shopId: string;
}

export interface IShopsServiceRestore {
	shopId: string;
}
