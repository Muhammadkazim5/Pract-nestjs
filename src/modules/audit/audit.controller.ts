import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async findAll(
    @Query('admin_id') admin_id?: string,
    @Query('action') action?: string,
    @Query('target_type') target_type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filter: any = {};
    if (admin_id) filter.admin_id = Number(admin_id);
    if (action) filter.action = action;
    if (target_type) filter.target_type = target_type;

    const options = { page: Number(page) || 1, limit: Number(limit) || 20 };

    const result = await this.auditService.findAll(filter, options);
    return {
      message: 'Audit logs retrieved successfully',
      data: result,
    };
  }
}
