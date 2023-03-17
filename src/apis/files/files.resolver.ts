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
		{
			description:
				' 이미지 업로드 API. dogId를 전달하면 강아지 이미지를 업로드할 수 있고 dogId를 전달하지 않으면 유저 프로필 이미지를 업로드할 수 있음',
		},
	)
	@UseGuards(GqlAuthGuard('access'))
	uploadImage(
		@Args({
			name: 'file',
			type: () => GraphQLUpload,
		})
		image: FileUpload,
		@Args({
			name: 'dogId',
			nullable: true,
		})
		dogId: string,
		@Context() context: IContext,
	): Promise<void | string[]> {
		return this.filesService.uploadImage({ image, dogId, context });
	}
}
