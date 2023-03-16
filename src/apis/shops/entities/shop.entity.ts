import { Field, ObjectType } from '@nestjs/graphql';
import {
	Column,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
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

	@DeleteDateColumn({ nullable: true })
	@Field(() => Date)
	deleteAt?: Date;

	// // 가게(own):예약 = 1:N
	// @OneToMany(() => Reservation, (reservation) => reservation.id, {
	// 	nullable: true,
	// })
	// @Field(() => [Reservation])
	// reservation?: Reservation[];
}
