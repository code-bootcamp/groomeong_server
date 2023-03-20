import { Field, ObjectType } from '@nestjs/graphql';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
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

	// 삭제 기능 넣을 시, @DeleteDateColumn 생성해준다

	// // Shop(own): 예약 = 1:N // OneToMany 받음
	// @ManyToOne(() => Shop, (shop) => shop.reservation, { nullable: false })
	// @Field(() => Shop)
	// shop: Shop;

	// // User(own) : 예약 =  1:N
	// @ManyToOne(() => User, (user)=> user.reservation, { nullable: false })
	// @Field(() => User)
	// user: User;

	// // Dog(own) : 예약 = 1:N
	// @ManyToOne(() => Dog, (dog)=> dog.reservation, { nullable: false })
	// @Field(() => Dog)
	// dog: Dog;
}
