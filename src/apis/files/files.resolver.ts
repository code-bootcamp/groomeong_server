import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from './files.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class FilesResolver {
	constructor(
		private readonly filesService: FilesService, //
	) {}

	@Mutation(
		() => [String], //
		{ description: ' Return: 프로필 이미지 주소 배열 ' },
	)
	@UseGuards(GqlAuthGuard('access'))
	uploadProfileImage(
		@Args({
			name: 'file',
			type: () => GraphQLUpload,
		})
		image: FileUpload,
	): Promise<void | string[]> {
		return this.filesService.uploadImage({ image: [image] });
	}

	@Mutation(
		() => [String], //
		{ description: ' Return: 강아지 이미지 주소 배열 ' },
	)
	@UseGuards(GqlAuthGuard('access'))
	uploadDogImage(
		@Args({
			name: 'file',
			type: () => GraphQLUpload,
		})
		image: FileUpload, //
		@Args('dogId')
		dogId: string,
	): Promise<void | string[]> {
		return this.filesService.uploadImage({ image: [image], dogId });
	}

	@Mutation(
		() => [String], //
		{ description: ' Return: 미용샵 이미지 주소 배열 ' },
	)
	uploadShopImages(
		@Args({
			name: 'files', //
			type: () => [GraphQLUpload],
		})
		images: FileUpload[], //
		@Args('shopId')
		shopId: string, //
	): Promise<void | string[]> {
		return this.filesService.uploadImage({ image: images, shopId });
	}
}
