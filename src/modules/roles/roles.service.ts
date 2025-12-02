import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}
  async create(
    createRoleDto: CreateRoleDto,
  ): Promise<{ message: string; data: Role }> {
    const role = this.roleRepository.create(createRoleDto);
    const result = await this.roleRepository.save(role);
    return {
      message: 'Role created successfully',
      data: result,
    };
  }

  async findAll(filter, options): Promise<{ message: string; data: any }> {
    const queryBuilder = await this.filterData(filter);
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;

    const [items, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };

    return {
      message: 'Roles retrieved successfully',
      data: result,
    };
  }
  filterData = (filter) => {
    const queryBuilder = this.roleRepository.createQueryBuilder('r');
    if (filter.id) {
      queryBuilder.andWhere('r.id = :id', { id: filter.id });
    }
    if (filter.name) {
      queryBuilder.andWhere('r.name ILIKE :name', { name: `%${filter.name}%` });
    }
    queryBuilder.orderBy('r.id', 'DESC');

    return queryBuilder;
  };
  async findOne(id: number): Promise<{ message: string; data: Role }> {
    const result = await this.roleRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException('Role not found');
    }
    return {
      message: 'Role retrieved successfully',
      data: result,
    };
  }

  async update(
    id: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string; data: Role }> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    Object.assign(role, updateRoleDto);
    const result = await this.roleRepository.save(role);
    return {
      message: 'Role updated successfully',
      data: result,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    await this.roleRepository.delete(id);
    return {
      message: 'Role deleted successfully',
    };
  }
}
