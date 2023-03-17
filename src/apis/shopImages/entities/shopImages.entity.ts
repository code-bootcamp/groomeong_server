import { Field, ObjectType } from '@nestjs/graphql';
import { Shop } from 'src/apis/shops/entities/shop.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ShopImage {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => String)
	id: string;

	@Column()
	@Field(() => String)
	imageUrl: string;

	@Column({ default: false })
	@Field(() => Boolean)
	isThumbnail: boolean;

	// // 가게(own): 가게이미지 = 1:N // OneToMany 받음
	// @ManyToOne(() => Shop, (shop) => shop.image)
	// @Field(() => Shop)
	// shop: Shop;
}
