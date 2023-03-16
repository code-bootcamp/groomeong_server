import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDogInput } from './dto/create-dog.input';
import { DogsService } from './dogs.service';
import { Dog } from './entities/dog.entity';
import { UpdateDogInput } from './dto/update-dog.input';

@Resolver()
export class DogsResolver {
	constructor(
		private readonly dogsService: DogsService, //
	) {}

	@Query(
		() => Dog,
		{ description: ' id로 강아지 조회 후 존재한다면 강아지 정보 반환' }, //
	)
	fetchDog(
		@Args('id') id: string, //
	): Promise<Dog> {
		return this.dogsService.findOneById({ id });
	}

	@Mutation(
		() => Dog,
		{ description: ' DB에 강아지 저장 후 생성한 강아지 정보 반환 ' }, //
	)
	createDog(
		@Args('createDogInput') createDogInput: CreateDogInput, //
	): Promise<Dog> {
		return this.dogsService.create({ createDogInput });
	}

	@Mutation(
		() => Dog,
		{
			description:
				' id로 강아지 조회 후 존재한다면 강아지 정보를 업데이트하고 업데이트한 강아지 정보 반환 ',
		}, //
	)
	updateDog(
		@Args('id') id: string, //
		@Args('updateDogInput') updateDogInput: UpdateDogInput, //
	): Promise<Dog> {
		return this.dogsService.updateOneById({ id, updateDogInput });
	}

	@Mutation(
		() => Boolean,
		{
			description:
				' id로 강아지 조회 후 존재한다면 강아지 정보 삭제, 삭제 여부 반환 ',
		}, //
	)
	deleteDog(
		@Args('id') id: string, //
	): Promise<boolean> {
		return this.dogsService.deleteOneById({ id });
	}
}
