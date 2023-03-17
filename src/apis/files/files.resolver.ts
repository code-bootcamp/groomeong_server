import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FilesService } from './files.service';
import { IContext } from '../../commons/interface/context';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class FilesResolver {
	constructor(
		private readonly filesService: FilesService, //
	) {}

	@Mutation(
		() => [String], //
		{ description: ' 유저 프로필 이미지 업로드 API ' },
	)
	@UseGuards(GqlAuthGuard('access'))
	uploadProfileImage(
		@Args({
			name: 'file',
			type: () => GraphQLUpload,
		})
		image: FileUpload,
	): Promise<void | string[]> {
		return this.filesService.uploadImage({ image });
	}

	@Mutation(
		() => [String], //
		{ description: ' 강아지 이미지 업로드 API ' },
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
		return this.filesService.uploadImage({ image, dogId });
	}
}
