import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dog } from './entities/dog.entity';
import {
	IDogsServiceCreate,
	IDogsServiceFindOneById,
} from './interfaces/dogs-service.interface';

@Injectable()
export class DogsService {
	constructor(
		@InjectRepository(Dog)
		private readonly dogsRepository: Repository<Dog>, //
	) {}

	async findOneById({ id }: IDogsServiceFindOneById): Promise<Dog> {
		const found = await this.dogsRepository.findOneBy({ id });

		if (!found) {
			throw new NotFoundException(`id ${id}를 갖는 강아지를 찾을 수 없음`);
		}

		return found;
	}

	async create({ createDogInput }: IDogsServiceCreate): Promise<Dog> {
		const dog = this.dogsRepository.create(createDogInput);
		this.dogsRepository.save(dog);
		return dog;
	}
}
