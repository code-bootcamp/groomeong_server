import { Field, ObjectType } from '@nestjs/graphql';
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

	@Column({ length: 10 })
	@Field(() => String)
	name: string;

	@Column({ length: 13 })
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

	// // 삭제 기능 생략되어 주석 처리함
	// @DeleteDateColumn({ nullable: true })
	// @Field(() => Date)
	// deleteAt?: Date;

	// 가게(own):예약 = 1:N
	@OneToMany(() => Reservation, (reservation) => reservation.shop, {
		nullable: true,
	})
	@Field(() => [Reservation])
	reservation?: Reservation[];

	// 가게(own):가게이미지 = 1:N
	@OneToMany(() => ShopImage, (shopImage) => shopImage.shop, {
		nullable: true,
	})
	@Field(() => [ShopImage])
	image?: ShopImage[];

	// 가게(own):리뷰 = 1:N
	@OneToMany(() => Review, (review) => review.shop, {
		nullable: true,
	})
	@Field(() => [Review])
	review?: Review[];

	// logstash 데이터 폴링 기준 칼럼
	@UpdateDateColumn()
	updatedAt: Date;
}
