import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Order } from '../orders/entities/order.entity';
import { DashboardStatsDto } from './dto/stats-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async getStats(
    start?: string,
    end?: string,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<DashboardStatsDto[]> {
    const match: Record<string, unknown> = {};

    if (start && end) {
      match.date = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    let dateFormat = '%Y-%m-%d';
    if (groupBy === 'month') dateFormat = '%Y-%m';
    else if (groupBy === 'week') dateFormat = '%Y-%U';

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$date' },
          },
          totalOrders: { $sum: 1 },
          averageTotal: { $avg: '$total' },
          totalRevenue: { $sum: '$total' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    return this.orderModel.aggregate<DashboardStatsDto>(pipeline);
  }
}
