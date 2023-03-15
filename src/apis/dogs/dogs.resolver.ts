import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DogsService } from './dogs.service';
import { CreateDogInput } from './dto/create-dog.input';
import { Dog } from './entities/dog.entity';

@Resolver()
export class DogsResolver {
	constructor(
		private readonly dogsService: DogsService, //
	) {}

	@Query(() => String)
	fetchDog(
		@Args('id') id: string, //
	): string {
		// return this.dogsService.findOneById({ id });
		return '임시 쿼리문';
	}

	@Mutation(() => Dog)
	createDog(
		@Args('createDogInput') createDogInput: CreateDogInput, //
	): Promise<Dog> {
		return this.dogsService.create({ createDogInput });
	}
}
