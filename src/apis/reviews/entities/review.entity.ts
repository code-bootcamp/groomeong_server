import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
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
	createAt: Date;

	@Column()
	@Field(() => Float)
	star: number;

	// 회원(own) : 리뷰 = 1 : N //OneToMany 받음
	// // 회원 쪽에서 관계 설정 시 주석 해제 예정
	// @ManyToOne(() => User, (user) => user.review)
	// @Field(() => User)
	// user: User;

	// // 가게 : 리뷰 = 1:N //OneToMany 받음
	@ManyToOne(() => Shop, (shop) => shop.review)
	@Field(() => Shop)
	shop: Shop;
}
