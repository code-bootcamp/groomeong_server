import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { ShopImage } from 'src/apis/shopImages/entities/shopImages.entity';
import {
	Column,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Shop {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => String)
	id: string;

	@Column({ length: 30 })
	@Field(() => String)
	name: string;

	@Column({ length: 30 })
	@Field(() => String)
	phone: string;

	@Column()
	@Field(() => String)
	openHour: string;

	@Column()
	@Field(() => String)
	closeHour: string;

	@Column({ length: 100 })
	@Field(() => String)
	address: string;

	@Column()
	@Field(() => Int)
	code: number;

	@Column()
	@Field(() => String)
	lat: string;

	@Column()
	@Field(() => String)
	lng: string;

	// 리뷰 평균 점수
	@Column({ type: 'decimal', nullable: true })
	@Field(() => Float)
	averageStar?: number;

	// 가게(own):예약 = 1:N
	@OneToMany(() => Reservation, (reservation) => reservation.shop, {
		nullable: true,
	})
	@Field(() => [Reservation], { nullable: true })
	reservation: Reservation[];

	// 가게(own):가게이미지 = 1:N
	@OneToMany(() => ShopImage, (shopImage) => shopImage.shop, {
		nullable: true,
	})
	@Field(() => [ShopImage], { nullable: true })
	image: ShopImage[];

	// 가게(own):리뷰 = 1:N
	@OneToMany(() => Review, (review) => review.shop, {
		nullable: true,
	})
	@Field(() => [Review], { nullable: true })
	review: Review[];

	// logstash 데이터 폴링 기준 칼럼
	@UpdateDateColumn()
	updatedAt: Date;

	// 삭제 일시
	@DeleteDateColumn({ nullable: true })
	@Field(() => Date)
	deletedAt?: Date;
}
