import { IsArray, IsNotEmpty, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  productIds: Types.ObjectId[];

  @IsDateString()
  date: string;
}
