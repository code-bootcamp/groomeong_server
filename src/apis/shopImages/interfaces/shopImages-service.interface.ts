export interface IShopImagesServiceSave {
	imageUrl: string;
	isThumbnail: boolean;
	shopId: string;
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
