import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDogInput } from './dto/create-dog.input';
import { DogsService } from './dogs.service';
import { Dog } from './entities/dog.entity';
import { UpdateDogInput } from './dto/update-dog.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { IContext } from 'src/commons/interface/context';

@Resolver()
@UseGuards(GqlAuthGuard('access'))
export class DogsResolver {
	constructor(
		private readonly dogsService: DogsService, //
	) {}

	@Query(
		() => Dog,
		{ description: ' Return: id로 조회된 강아지 데이터 ' }, //
	)
	fetchDog(
		@Args('id') id: string, //
	): Promise<Dog> {
		return this.dogsService.findOneById({ id });
	}

	@Query(
		() => [Dog], //
		{ description: ' Return: 유저가 등록한 모든 강아지 데이터 ' },
	)
	fetchUserDogs(
		@Context() context: IContext, //
	): Promise<Dog[]> {
		const userId = context.req.user.id;
		return this.dogsService.findByUserId({ userId });
	}

	@Mutation(
		() => Dog,
		{ description: ' Return: DB에 저장된 강아지 데이터 ' }, //
	)
	createDog(
		@Args('createDogInput') createDogInput: CreateDogInput, //
		@Context() context: IContext, //
	): Promise<Dog> {
		const userId = context.req.user.id;
		return this.dogsService.create({ createDogInput, userId });
	}

	@Mutation(
		() => Dog,
		{ description: ' Return: 업데이트한 강아지 데이터 ' }, //
	)
	updateDog(
		@Args('id') id: string, //
		@Args('updateDogInput') updateDogInput: UpdateDogInput, //
	): Promise<Dog> {
		return this.dogsService.updateOneById({ id, updateDogInput });
	}

	@Mutation(
		() => Boolean,
		{ description: ' Return: id로 강아지 데이터 삭제 후 삭제 여부 반환 ' }, //
	)
	deleteDog(
		@Args('id') id: string, //
		@Context() context: IContext,
	): Promise<boolean> {
		const userId = context.req.user.id;
		return this.dogsService.deleteOneById({ id, userId });
	}
}
