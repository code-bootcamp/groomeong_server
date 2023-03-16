import { Dog } from './entities/dog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	IDogsServiceCreate,
	IDogsServiceDeleteById,
	IDogsServiceFindOneById,
} from './interfaces/dogs-service.interface';
import { Repository } from 'typeorm';

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
		await this.dogsRepository.save(dog);
		return dog;
	}

	async updateOneById({ id, updateDogInput }): Promise<Dog> {
		const founded = await this.findOneById({ id });
		const updated = await this.dogsRepository.save({
			...founded,
			...updateDogInput,
		});
		return updated;
	}

	async deleteOneById({ id }: IDogsServiceDeleteById): Promise<boolean> {
		await this.findOneById({ id });
		const result = await this.dogsRepository.softDelete({ id });
		return result ? true : false;
	}
}
