import { CreateShopInput } from "../dto/create-shop.input";
import { UpdateShopInput } from "../dto/update-shop.input";

export interface IShopsServiceCreate {
	createShopInput: CreateShopInput;
}

export interface IShopsServiceFindOne {
	shopId: string;
}

export interface IShopsServiceUpdate {
	shopId: string;
	updateShopInput: UpdateShopInput;
}

export interface IShopsServiceDelete {
	shopId: string;
}
