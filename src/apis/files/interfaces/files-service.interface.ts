import { FileUpload } from 'graphql-upload';

export interface IFilesServiceUploadImage {
	image: FileUpload[];
	dogId?: string;
	shopId?: string;
}
