import { FileUpload } from 'graphql-upload';
import { IContext } from 'src/commons/interface/context';

export interface IFilesServiceUploadImage {
	image: FileUpload;
	dogId?: string;
	context: IContext;
}
