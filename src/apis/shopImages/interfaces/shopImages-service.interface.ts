import { SaveShopImageInput } from '../dto/save-shopImage.input';

export interface IShopImagesServiceSave {
	imageUrl: string;
	saveShopImageInput: SaveShopImageInput;
}

export interface IShopImagesServiceFindById {
	shopImageId: string;
}

export interface IShopImagesServiceFindByShopId {
	shopId: string;
}

export interface IShopImagesServiceDelete {
	shopImageId: string;
}
