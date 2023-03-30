import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from 'src/apis/reviews/entities/review.entity';
import { User } from 'src/apis/users/entities/user.entity';

@ObjectType()
export class returnUserWithReviewOutput {
	@Field(() => User)
	profile: User;

	@Field(() => Review)
	review: Review;
}
