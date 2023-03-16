import { CreateDogInput } from './create-dog.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDogInput extends PartialType(CreateDogInput) {}
