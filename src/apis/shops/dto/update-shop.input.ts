import { InputType, PartialType } from '@nestjs/graphql';
import { CreateShopInput } from './create-shop.input';

@InputType()
export class UpdateShopInput extends PartialType(CreateShopInput) {}
