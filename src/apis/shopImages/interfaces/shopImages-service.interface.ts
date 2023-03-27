import { UpdateShopImageInput } from '../dto/update-shopImage.input';

export interface IShopImagesServiceSave {
	imageUrl: string;
	isThumbnail: boolean;
	shopId: string;
}

export interface IShopImagesServiceFindById {
	shopImageId: string;
}

export interface IShopImagesServiceFindThumbnail {
	shopId: string;
}

export interface IShopImagesServiceFindByShopId {
	shopId: string;
}

export interface IShopImagesServiceUpdate {
	updateShopImageInput: UpdateShopImageInput;
}

export interface IShopImagesServiceDelete {
	shopImageId: string;
}
