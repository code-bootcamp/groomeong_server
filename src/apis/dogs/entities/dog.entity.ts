import {
	Field,
	Float,
	Int,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { DOG_TYPE } from '../enum/dog-type.enum';

registerEnumType(DOG_TYPE, {
	name: 'DOG_TYPE',
});

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
		type: 'enum',
		enum: DOG_TYPE,
	})
	@Field(() => DOG_TYPE)
	breed: DOG_TYPE;

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

	@DeleteDateColumn({ nullable: true })
	@Field(() => Date)
	deletedAt: Date;
}
