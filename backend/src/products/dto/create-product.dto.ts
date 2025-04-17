import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @Transform(({ value }: { value: string | string[] }) => {
    const ids = Array.isArray(value) ? value : String(value).split(',');
    return ids.map((id: string) => new Types.ObjectId(id.trim()));
  })
  @IsArray()
  @IsOptional()
  categoryIds?: Types.ObjectId[];

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
