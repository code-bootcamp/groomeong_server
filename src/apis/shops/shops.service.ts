import {
	ConflictException,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import {
	IShopsServiceCreate,
	IShopsServiceDelete,
	IShopsServiceFilterReservations,
	IShopsServiceFindAll,
	IShopsServiceFindById,
	IShopsServiceGetLatLngByAddress,
	IShopsServiceUpdate,
} from './interface/shops-service.interface';
import axios from 'axios';
import { districtCode } from 'src/commons/utils/addresscode';
import { AutocompleteShopsOutput } from './dto/return-shop.output';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class ShopsService {
	constructor(
		@InjectRepository(Shop)
		private readonly shopsRepository: Repository<Shop>, //
	) {}

	// 리뷰 평점 순으로 검색 결과 반환
	sortByAvgStar({ hits: _hits }): AutocompleteShopsOutput[] {
		if (_hits.length === 0) {
			return null;
		}

		const hits = _hits.map((hit) => hit._source);
		hits.sort((a, b) => {
			return b.averagestar - a.averagestar;
		});
		return hits;
	}

	// DB의 모든 가게 정보 불러오기 + 페이징 추가
	async findAll({ page, count }: IShopsServiceFindAll): Promise<Shop[]> {
		const allShops = await this.shopsRepository.find({
			relations: [
				'reservation',
				'image',
				'review',
				'reservation.review',
				'reservation.user',
			],
			skip: (page - 1) * count,
			take: count,
		});

		// <---------- 썸네일 이미지 관련 로직 ---------->
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

		// <---------- 별점 관련 로직 ---------->
		// 별점평균이 Null인 경우, 리턴 타입이 number 이므로 0으로 변환하기
		allShops.forEach((el) => {
			el.averageStar === null
				? (el.averageStar = 0)
				: (el.averageStar = el.averageStar);
		});

		return allShops;
	}

	filterReservations({
		reservations,
	}: IShopsServiceFilterReservations): Reservation[] {
		return reservations.filter(
			(reservation) => reservation.user && reservation.review,
		);
	}

	// 가게 데이터 찾기
	async findById({ shopId }: IShopsServiceFindById): Promise<Shop> {
		const myShop = await this.shopsRepository.findOne({
			where: { id: shopId },
			relations: [
				'reservation',
				'image',
				'review',
				'reservation.review',
				'reservation.user',
			],
		});

		// 유저가 존재하고 리뷰까지 작성한 경우만 필터링
		myShop.reservation = this.filterReservations({
			reservations: myShop.reservation,
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
		const { address } = createShopInput;
		const checkShop = await this.shopsRepository.findOne({
			where: { address },
		});

		if (checkShop) {
			throw new ConflictException(
				`주소 ${address}로 등록된 가게가 이미 있습니다`,
			);
		}

		// 지역구를 지역코드로 변환하기
		const district = address.split(' ')[1];
		const code = districtCode({ district });

		// 주소에 대한 위도, 경도 가져오기
		const [lat, lng] = await this.getLatLngByAddress({ address });

		const result = await this.shopsRepository.save({
			...createShopInput,
			lat,
			lng,
			code,
		});

		return result;
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
				`id가 ${shopId}인 가게를 찾을 수 없습니다`,
			);
		}

		const myShop = await this.findById({ shopId });
		const _averageStar = myShop.averageStar === 0 ? null : myShop.averageStar;
		const result = await this.shopsRepository.save({
			...myShop,
			...updateShopInput,
			averageStar: _averageStar,
		});

		return result;
	}

	// 가게 삭제
	async delete({ shopId }: IShopsServiceDelete): Promise<boolean> {
		const checkShop = await this.shopsRepository.findOne({
			where: { id: shopId },
		});

		if (!checkShop) {
			throw new UnprocessableEntityException(
				`id가 ${shopId}인 가게를 찾을 수 없습니다`,
			);
		}

		const result = await this.shopsRepository.softDelete({ id: shopId });

		return result.affected ? true : false;
	}

	// // <--- 기능 필요하면 주석 해제 --->
	// // 삭제된 가게 리스트 불러오기
	// async findAllDeleted(): Promise<Shop[]> {
	// 	return await this.shopsRepository.find({
	// 		withDeleted: true,
	// 		relations: ['reservation'],
	// 	});
	// }

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
