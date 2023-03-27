import {
	ConflictException,
	Injectable,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { districtCode } from 'src/commons/utils/addresscode';

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	// DB의 모든 가게 정보 불러오기
	async findAll(): Promise<Shop[]> {
		const allShops = await this.shopsRepository.find({
			relations: ['reservation', 'image', 'review'],
		});

		// 썸네일 이미지가 있는지 확인
		// 썸네일이 있으면 각 가게의 image = 썸네일 이미지
		let checkThumbnail = 0;
		allShops.forEach((el) => {
			const idx = el.image.findIndex((el) => el.isThumbnail === true);
			if (idx >= 0) {
				el.image = [el.image[idx]];
				checkThumbnail = idx;
			}
		});

		// 썸네일 이미지가 없으면 각 가게의 image = null
		if (checkThumbnail < 0) {
			allShops.forEach((el) => (el.image = null));
		}

		// 별점평균이 Null인 경우, 리턴 타입이 number 이므로 0으로 변환하기
		allShops.forEach((el) => {
			el.averageStar === null
				? (el.averageStar = 0)
				: (el.averageStar = el.averageStar);
		});

		return allShops;
	}

	// 가게 데이터 찾기
	async findById({ shopId }: IShopsServiceFindById): Promise<Shop> {
		const myShop = await this.shopsRepository.findOne({
			where: { id: shopId },
			relations: ['reservation', 'image', 'review'],
		});

		if (!myShop) {
			throw new UnprocessableEntityException(`가게를 찾을 수 없습니다`);
		}

		let sum = 0;
		myShop.review.map((el) => {
			sum += Number(el.star);
		});
		const _averageStar = sum
			? Number((sum / myShop.review.length).toFixed(1))
			: 0;

		return {
			...myShop,
			averageStar: _averageStar,
		};
	}

	// 가게 신규 생성
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

		// 구지역을 코드로 뽑기 위한 로직
		const district = _address.split(' ')[1];
		const code = await districtCode({ district });

		const [lat, lng] = await this.getLatLngByAddress({ address: _address });

		return await this.shopsRepository.save({
			...createShopInput,
			lat,
			lng,
			code,
		});
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

	// 가게 업데이트
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

	// // <--- 기능 필요하면 주석 해제 --->
	// // 가게 연락처(phone)로 해당 가게 정보 찾기
	// async findByPhone({ phone }: IShopsServiceFindByPhone): Promise<Shop> {
	// 	const result = await this.shopsRepository.findOne({
	// 		where: { phone: phone },
	// 		relations: ['reservation', 'image', 'review'],
	// 	});

	// 	if (!result) {
	// 		throw new UnprocessableEntityException(
	// 			`연락처가 ${phone}인 가게를 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return result;
	// }

	// // 가게 주소(address)로 해당 가게 정보 찾기
	// async findByAddress({ address }: IShopsServiceFindByAddress): Promise<Shop> {
	// 	const result = await this.shopsRepository.findOne({
	// 		where: { address: address },
	// 		relations: ['reservation', 'image', 'review'],
	// 	});

	// 	if (!result) {
	// 		throw new UnprocessableEntityException(
	// 			`주소가 ${address}인 가게를 찾을 수 없습니다`,
	// 		);
	// 	}

	// 	return result;
	// }

	// // 삭제 처리된 모든 가게 정보 불러오기
	// async findAllDeleted(): Promise<Shop[]> {
	// 	return await this.shopsRepository.find({
	// 		withDeleted: true,
	// 		// relations: ['reservation'],
	// 	});
	// }

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

	// // 가게 삭제
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

	// // 삭제된 가게 정보 복원
	// async restore({ shopId }: IShopsServiceRestore): Promise<boolean> {
	// 	const checkDeletedShop = await this.findDeleted({ shopId });

	// 	if (!checkDeletedShop) {
	// 		throw new NotFoundException(`ID가 ${shopId}인 가게를 찾을 수 없습니다`);
	// 	}

	// 	const result = await this.shopsRepository.restore({ id: shopId });

	// 	return result.affected ? true : false;
	// }
}
