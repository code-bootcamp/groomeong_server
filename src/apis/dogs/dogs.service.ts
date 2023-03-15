import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from './entities/dog.entity';
import { IDogsServiceCreate } from './interfaces/dogs-service.interface';

@Injectable()
export class DogsService {
	constructor(
		@InjectRepository(Dog)
		private readonly dogsRepository: Repository<Dog>, //
	) {}

	async create({ createDogInput }: IDogsServiceCreate): Promise<Dog> {
		const dog = this.dogsRepository.create(createDogInput);
		this.dogsRepository.save(dog);
		return dog;
	}
}
