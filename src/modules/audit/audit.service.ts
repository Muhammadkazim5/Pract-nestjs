import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async create(
    admin_id: number | null,
    action: string,
    target_id: number | null,
    target_type?: string,
    details?: any,
  ) {
    const log = this.auditRepository.create({
      admin_id,
      action,
      target_id,
      target_type,
      details,
    });
    return this.auditRepository.save(log);
  }

  async findAll(filter?: any, options?: { page?: number; limit?: number }) {
    const queryBuilder = this.auditRepository.createQueryBuilder('a');

    if (filter?.admin_id) {
      queryBuilder.andWhere('a.admin_id = :admin_id', {
        admin_id: filter.admin_id,
      });
    }
    if (filter?.action) {
      queryBuilder.andWhere('a.action = :action', { action: filter.action });
    }
    if (filter?.target_type) {
      queryBuilder.andWhere('a.target_type = :target_type', {
        target_type: filter.target_type,
      });
    }

    queryBuilder.orderBy('a.id', 'DESC');

    const page = Number(options?.page) || 1;
    const limit = Number(options?.limit) || 20;

    const [items, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        totalItems,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}
