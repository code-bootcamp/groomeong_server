import {
	Field,
	Float,
	Int,
	ObjectType,
	registerEnumType,
} from '@nestjs/graphql';
import { Reservation } from 'src/apis/reservations/entities/reservation.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
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
		type: 'text',
		nullable: true,
	})
	@Field(() => String, { nullable: true })
	specifics: string;

	@Column({
		length: 100,
		nullable: true,
	})
	@Field(() => String, { nullable: true })
	image: string;

	@CreateDateColumn()
	createdAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;

	@ManyToOne(() => User, (user) => user.dogs)
	@Field(() => User)
	user: User;

	// Dog : Reservation = 1 : N
	@OneToMany(
		() => Reservation,
		(reservation) => reservation.dog, //
		{ nullable: true },
	)
	@Field(
		() => [Reservation], //
		{ nullable: true },
	)
	reservation: Reservation[];
}
