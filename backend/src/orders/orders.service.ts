import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const products = await this.productModel.find({
      _id: { $in: dto.productIds },
    });

    if (products.length !== dto.productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const total = products.reduce((sum, p) => sum + p.price, 0);

    const created = new this.orderModel({
      productIds: dto.productIds,
      total,
      date: new Date(dto.date),
    });

    const savedOrder = await created.save();

    try {
      await axios.post(
        process.env.LAMBDA_URL || 'http://lambda:3003/dev/notify',
        {
          id: savedOrder._id,
          total: savedOrder.total,
          productIds: savedOrder.productIds,
        },
      );
      console.log('Notification sent to Lambda!');
    } catch (err) {
      console.error('Error notifying Lambda:', err);
    }

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('productIds').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('productIds');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const updated = await this.orderModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Order not found');
  }
}
