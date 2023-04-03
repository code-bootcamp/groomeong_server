import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	DeleteDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Review {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => String)
	id: string;

	@Column()
	@Field(() => String)
	contents: string;

	@CreateDateColumn({ nullable: true })
	@Field(() => Date)
	createdAt: Date;

	@Column()
	@Field(() => Float)
	star: number;

	@DeleteDateColumn()
	deletedAt: Date;

	// 예약(own) : 리뷰 = 1 : 1 // FK컬럼이 생기는 곳 = 리뷰
	@JoinColumn()
	@OneToOne(() => Reservation, (reservation) => reservation.review)
	@Field(() => Reservation)
	reservation: Reservation;

	// // 가게 : 리뷰 = 1:N //OneToMany 받음
	@ManyToOne(() => Shop, (shop) => shop.review)
	@Field(() => Shop)
	shop: Shop;
}
