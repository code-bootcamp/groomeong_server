import { Storage } from '@google-cloud/storage';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IFilesServiceUploadImage } from './interfaces/files-service.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
	async uploadImage({
		image: _image,
		dogId,
		shopId,
	}: IFilesServiceUploadImage): Promise<void | string[]> {
		const bucket = process.env.GCP_BUCKET_NAME;
		const storage = new Storage({
			projectId: process.env.GCP_PROJECT_ID,
			keyFilename: `/groomeong-backend-secrets/${process.env.GCP_KEY_FILENAME}`,
		});
		const images = await Promise.all(_image);
		const results = await Promise.all(
			images.map((image) => {
				return new Promise<string>((resolve, reject) => {
					let filename = '';

					if (dogId) {
						filename = `origin/dog/${uuid()}/${image.filename}`;
					} else if (shopId) {
						filename = `origin/shop/${uuid()}/${image.filename}`;
					} else {
						filename = `origin/profile/${uuid()}/${image.filename}`;
					}

					image
						.createReadStream()
						.pipe(storage.bucket(bucket).file(filename).createWriteStream())
						.on('finish', () => resolve(`${bucket}/${filename}`))
						.on('error', () => reject('파일 업로드 실패!'));
				});
			}),
		).catch((error) => {
			throw new InternalServerErrorException(error);
		});

		return results;
	}
}
