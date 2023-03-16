import { Field, ObjectType } from '@nestjs/graphql';
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

	// // Shop(own): 예약 = 1:N
	// @ManyToOne(()=> , ()=>, {nullable: false})
	// @Field(()=>[Shop])
	// shop: Shop[];

	// // User(own) : 예약 =  1:N
	// @ManyToOne(()=> , ()=>, {nullable: false})
	// @Field(()=>[User])
	// user: User[];

	// // Dog(own) : 예약 = 1:N
	// @ManyToOne(()=> , ()=>, {nullable: false})
	// @Field(()=>[Dog])
	// dog: Dog[];
}
