import { SaveShopImageInput } from '../dto/save-shopImage.input';

export interface IShopImagesServiceSave {
	shopId: string;
	saveShopImageInput: SaveShopImageInput;
}

export interface IShopImagesServiceFindById {
	shopImageId: string;
}

export interface IShopImagesServiceFindByShopId {
	shopId: string;
}
