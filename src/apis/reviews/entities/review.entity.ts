import { Field, Float, ObjectType } from '@nestjs/graphql';
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

	@Column({ length: 10 })
	@Field(() => String)
	writer: string;

	@Column()
	@Field(() => String)
	contents: string;

	@CreateDateColumn()
	@Field(() => Date)
	createAt: Date;

	@Column()
	@Field(() => Float)
	star: number;

	// // 회원(own) : 리뷰 = 1 : N //OneToMany 받음
	// // 회원 쪽에서 관계 설정 시 주석 해제 예정
	// @ManyToOne(() => User, (user) => user.id)
	// @Field(() => User)
	// user: User[];

	// 가게 : 리뷰 = 1:N 관계 설정이 가능하지만, 유저 관점의 서비스이므로 가게(관리자 페이지)와 예약 사이의 관계 설정은 생략했다
}
