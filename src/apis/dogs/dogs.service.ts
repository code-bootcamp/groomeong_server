import { Dog } from './entities/dog.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
	IDogsServiceCreate,
	IDogsServiceDeleteById,
	IDogsServiceFindByUserId,
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
		const found = await this.dogsRepository.findOne({
			where: { id },
			relations: { user: true },
		});

		if (!found) {
			throw new NotFoundException(`id ${id}를 갖는 강아지를 찾을 수 없음`);
		}

		return found;
	}

	async findByUserId({ userId }: IDogsServiceFindByUserId): Promise<Dog[]> {
		const founds = await this.dogsRepository.findBy({
			user: {
				id: userId,
			},
		});
		return founds;
	}

	async create({ createDogInput, userId }: IDogsServiceCreate): Promise<Dog> {
		const dog = await this.dogsRepository.save({
			...createDogInput,
			user: {
				id: userId,
			},
		});
		return dog;
	}

	async deleteOneById({
		id,
		userId,
	}: IDogsServiceDeleteById): Promise<boolean> {
		await this.findOneById({ id });
		const result = await this.dogsRepository.softDelete({
			id,
			user: {
				id: userId,
			},
		});
		return result ? true : false;
	}
}
