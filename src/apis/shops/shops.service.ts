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

		let checkThumbnail = 0;
		allShops.forEach((el) => {
			const idx = el.image.findIndex((el) => el.isThumbnail === true);
			if (idx >= 0) {
				el.image = [el.image[idx]];
				checkThumbnail = idx;
			}
		});

		if (checkThumbnail < 0) {
			allShops.forEach((el) => (el.image = null));
		}

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

		const district = address.split(' ')[1];
		const code = districtCode({ district });

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
}
