import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DogsService } from './dogs.service';
import { CreateDogInput } from './dto/create-dog.input';
import { Dog } from './entities/dog.entity';

@Resolver()
export class DogsResolver {
	constructor(
		private readonly dogsService: DogsService, //
	) {}

	@Mutation(() => Dog)
	createDog(
		@Args('createDogInput') createDogInput: CreateDogInput, //
	): Promise<Dog> {
		return this.dogsService.create({ createDogInput });
	}
}
