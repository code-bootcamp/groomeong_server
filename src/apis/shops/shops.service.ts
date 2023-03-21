import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../reviews/entities/review.entity';
import { Shop } from './entities/shop.entity';
import {
	IShopsServiceCreate,
	IShopsServiceDelete,
	IShopsServiceFindByAddress,
	IShopsServiceFindById,
	IShopsServiceFindByPhone,
	IShopsServiceFindDeleted,
	IShopsServiceRestore,
	IShopsServiceUpdate,
} from './interface/shops-service.interface';

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	// 신규 가게 정보 생성
	async create({
		address,
		createShopInput,
	}: IShopsServiceCreate): Promise<Shop> {
		const checkShop = await this.shopsRepository.findOne({
			where: { address: address },
		});

		if (checkShop) {
			throw new ConflictException(
				`해당 주소(${address})로 등록된 가게가 있습니다`,
			);
		}

		return await this.shopsRepository.save({ ...createShopInput });
	}

	// 가게ID로 해당 가게 정보 찾기
	async findById({ shopId }: IShopsServiceFindById): Promise<Shop> {
		const myshop = await this.shopsRepository.findOne({
			where: { id: shopId },
			relations: ['reservation', 'image', 'review'],
		});

		const reviews = myshop.review; //배열
		let sum = 0;
		reviews.map((el) => {
			sum += Number(el.star);
		});

		const _averageStar = Number((sum / reviews.length).toFixed(1));

		return {
			...myshop,
			averageStar: _averageStar,
		};
	}

	// DB의 모든 가게 정보 불러오기
	async findAll(): Promise<Shop[]> {
		const allShops = await this.shopsRepository.find({
			relations: ['reservation', 'image', 'review'],
		});

		return allShops;
		// 엘라스틱서치 적용 후 서비스 구현 방향이 정해지고 난 뒤 로직 재구성하기
	}

	// 가게 연락처(phone)로 해당 가게 정보 찾기
	async findByPhone({ phone }: IShopsServiceFindByPhone): Promise<Shop> {
		const result = await this.shopsRepository.findOne({
			where: { phone: phone },
			relations: ['reservation', 'image', 'review'],
		});

		if (!result) {
			throw new NotFoundException(
				`연락처가 ${phone}인 가게를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// 가게 주소(address)로 해당 가게 정보 찾기
	async findByAddress({ address }: IShopsServiceFindByAddress): Promise<Shop> {
		const result = await this.shopsRepository.findOne({
			where: { address: address },
			relations: ['reservation', 'image', 'review'],
		});

		if (!result) {
			throw new NotFoundException(
				`주소가 ${address}인 가게를 찾을 수 없습니다`,
			);
		}

		return result;
	}

	// // 삭제 기능 생략되어 주석 처리함
	// // 삭제 처리된 모든 가게 정보 불러오기
	// async findAllDeleted(): Promise<Shop[]> {
	// 	return await this.shopsRepository.find({
	// 		withDeleted: true,
	// 		// relations: ['reservation'],
	// 	});
	// }

	// // 삭제 기능 생략되어 주석 처리함
	// // 삭제된 가게ID로 해당 가게 정보 가져오기
	// async findDeleted({ shopId }: IShopsServiceFindDeleted): Promise<Shop> {
	// 	const result = await this.shopsRepository.findOne({
	// 		where: { id: shopId },
	// 		withDeleted: true,
	// 		// relations: ['reservation'],
	// 	});

	// 	if (!result) {
	// 		throw new NotFoundException(
	// 			`삭제된 목록에서 ID가 ${shopId}인 가게를 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return result;
	// }

	// 가게ID로 가게 정보 업데이트하기
	async update({
		shopId,
		updateShopInput,
	}: IShopsServiceUpdate): Promise<Shop> {
		const checkShop = await this.shopsRepository.findOne({
			where: { id: shopId },
		});

		if (!checkShop) {
			throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
		}

		const myShop = await this.findById({ shopId });
		console.log(myShop);

		return this.shopsRepository.save({
			...myShop,
			...updateShopInput,
		});
	}

	// // 삭제 기능 생략되어 주석 처리함
	// // 가게ID로 가게 정보 삭제하기
	// async delete({ shopId }: IShopsServiceDelete): Promise<boolean> {
	// 	const checkShop = await this.shopsRepository.findOne({
	// 		where: { id: shopId },
	// 	});

	// 	if (!checkShop) {
	// 		throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
	// 	}

	// 	const result = await this.shopsRepository.softDelete({ id: shopId });

	// 	return result.affected ? true : false;
	// }

	// // 삭제 기능 생략되어 주석 처리함
	// // 삭제된 가게ID로 해당 가게 정보 복원하기
	// async restore({ shopId }: IShopsServiceRestore): Promise<boolean> {
	// 	const checkDeletedShop = await this.findDeleted({ shopId });

	// 	if (!checkDeletedShop) {
	// 		throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
	// 	}

	// 	const result = await this.shopsRepository.restore({ id: shopId });

	// 	return result.affected ? true : false;
	// }
}
