import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-users.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}
