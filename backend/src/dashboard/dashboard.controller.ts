import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/stats-dashboard.dto';
import { DashboardQueryDto } from './dto/query-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getStats(@Query() query: DashboardQueryDto): Promise<DashboardStatsDto[]> {
    return this.dashboardService.getStats(
      query.start,
      query.end,
      query.groupBy,
    );
  }
}
