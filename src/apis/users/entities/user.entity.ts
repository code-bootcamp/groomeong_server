import { Field, ObjectType } from '@nestjs/graphql';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => String)
	id: string;

	@Column({ length: 5 })
	@Field(() => String)
	name: string;

	@Column({ length: 30 })
	@Field(() => String)
	email: string;

	@Column({ length: 100 })
	@Field(() => String)
	password: string;

	@Column({ length: 16 })
	@Field(() => String)
	phone: string;

	@CreateDateColumn({ nullable: true })
	createAt: Date;

	@DeleteDateColumn({ nullable: true })
	deleteAt: Date;

	@UpdateDateColumn({ nullable: true })
	updateAt: Date;
}
