import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Dog {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => String)
	id: string;

	@Column({
		length: 10,
	})
	@Field(() => String)
	name: string;

	@Column()
	@Field(() => Int)
	age: number;

	@Column({
		type: 'decimal',
		precision: 4,
		scale: 1,
	})
	@Field(() => Float)
	weight: number;

	@Column({
		length: 20, //
	})
	@Field(() => String)
	breed: string;

	@Column({
		type: 'text', //
	})
	@Field(() => String)
	specifics: string;

	@Column({
		length: 100, //
	})
	@Field(() => String)
	image: string;

	@CreateDateColumn()
	@Field(() => Date)
	createdAt: Date;

	@DeleteDateColumn()
	@Field(() => Date)
	deletedAt: Date;
}
