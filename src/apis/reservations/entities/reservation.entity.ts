import { Field, ObjectType } from '@nestjs/graphql';
import { Dog } from 'src/apis/dogs/entities/dog.entity';
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

	// 예약 생성일자: DB에만 추가
	@CreateDateColumn()
	@Field(() => Date)
	createAt?: Date;

	@DeleteDateColumn({ nullable: true })
	deleteAt: Date;

	// Shop(own): 예약 = 1:N // OneToMany 받음
	@ManyToOne(() => Shop, (shop) => shop.reservation)
	@Field(() => Shop)
	shop: Shop;

	// User(own) : 예약 =  1:N
	@ManyToOne(() => User, (user) => user.reservation, { nullable: true })
	@Field(() => User)
	user: User;

	// Dog : Reservation = 1:1
	@JoinColumn()
	@OneToOne(() => Dog, (dog) => dog.reservation)
	@Field(() => Dog)
	dog: Dog;
}
