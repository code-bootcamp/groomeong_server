import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { Shop } from './entities/shop.entity';
import {
	IShopsServiceCreate,
	IShopsServiceDelete,
	IShopsServiceFindByAddress,
	IShopsServiceFindById,
	IShopsServiceFindByPhone,
	IShopsServiceFindDeleted,
	IShopsServiceGetLatLngByAddress,
	IShopsServiceRestore,
	IShopsServiceUpdate,
} from './interface/shops-service.interface';
import axios from 'axios';

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	// 신규 가게 정보 생성
	async create({ createShopInput }: IShopsServiceCreate): Promise<Shop> {
		const _address = createShopInput.address;
		const checkShop = await this.shopsRepository.findOne({
			where: { address: _address },
		});

		if (checkShop) {
			throw new ConflictException(
				`해당 주소(${_address})로 등록된 가게가 있습니다`,
			);
		}

		const [lat, lng] = await this.getLatLngByAddress({ address: _address });

		return await this.shopsRepository.save({ ...createShopInput, lat, lng });
	}

	async getLatLngByAddress({
		address,
	}: IShopsServiceGetLatLngByAddress): Promise<string[]> {
		try {
			const result = await axios.get(
				`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_MAP_API_KEY}&region=kr&address=${address}`,
			);
			const geometryResults = result.data.results;
			const { lat, lng } =
				geometryResults[geometryResults.length - 1].geometry.location;
			return [lat, lng].map(String);
		} catch (error) {
			throw new UnprocessableEntityException(
				'위도, 경도 정보를 가져올 수 없습니다.',
			);
		}
	}

	// 가게ID로 해당 가게 정보 찾기
	async findById({ shopId }: IShopsServiceFindById): Promise<Shop> {
		const myShop = await this.shopsRepository.findOne({
			where: { id: shopId },
			relations: ['reservation', 'image', 'review'],
		});

		if (!myShop) {
			throw new UnprocessableEntityException(
				`ID가 ${shopId}인 가게를 찾을 수 없습니다`,
			);
		}

		const reviews = myShop.review;
		let sum = 0;
		reviews.map((el) => {
			sum += Number(el.star);
		});
		const _averageStar = sum ? Number((sum / reviews.length).toFixed(1)) : 0;

		return {
			...myShop,
			averageStar: _averageStar,
		};
	}

	// DB의 모든 가게 정보 불러오기
	async findAll(): Promise<Shop[]> {
		const allShops = await this.shopsRepository.find({
			relations: ['reservation', 'image', 'review'],
		});

		// 썸네일 이미지가 있는지 검증 -> 이미지들 중 하나라도 isThumbnail === true 면,
		let checkThumbnail = 0;
		allShops.forEach((el) => {
			const idx = el.image.findIndex((el) => el.isThumbnail === true);
			if (idx >= 0) {
				el.image = [el.image[idx]];
				checkThumbnail = idx;
			}
		});

		// 썸네일 이미지가 없으면 각 가게의 이미지는 null 로 리턴
		if (checkThumbnail < 0) {
			allShops.forEach((el) => (el.image = null));
		}

		//별점평균이 Null 일때 리턴을 위해 0으로 변환하기
		allShops.forEach((el) => {
			el.averageStar === null
				? (el.averageStar = 0)
				: (el.averageStar = el.averageStar);
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
			throw new UnprocessableEntityException(
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
			throw new UnprocessableEntityException(
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
			throw new UnprocessableEntityException(
				`ID가 ${shopId}인 가게를 찾을 수 없습니다`,
			);
		}

		const myShop = await this.findById({ shopId });
		const _averageStar = myShop.averageStar === 0 ? null : myShop.averageStar;
		console.log(myShop);

		return this.shopsRepository.save({
			...myShop,
			...updateShopInput,
			averageStar: _averageStar,
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
