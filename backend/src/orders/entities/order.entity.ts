import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: [Types.ObjectId], ref: 'Product', required: true })
  productIds: Types.ObjectId[];

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  date: Date;
}

export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
