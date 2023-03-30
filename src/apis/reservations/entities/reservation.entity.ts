import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Reservation {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => String)
	id: string;

	@Column()
	@Field(() => Date)
	date: Date;

	@Column()
	@Field(() => String)
	time: string;

	// Shop(own): 예약 = 1:N // OneToMany 받음
	@ManyToOne(() => Shop, (shop) => shop.reservation)
	@Field(() => Shop)
	shop: Shop;

	// User(own) : 예약 =  1:N
	@ManyToOne(() => User, (user) => user.reservation)
	@Field(() => User)
	user: User;

	// Dog : Reservation = 1 : N
	@ManyToOne(() => Dog, (dog) => dog.reservation)
	@Field(() => Dog)
	dog: Dog;

	// Reservation : Review = 1 : 1
	@OneToOne(() => Review, (review) => review.reservation)
	@Field(() => Review, { nullable: true })
	review: Review;

	// 예약 생성일자
	@CreateDateColumn()
	createdAt?: Date;

	// 예약 취소일자
	@DeleteDateColumn({ nullable: true })
	deletedAt: Date;
}
