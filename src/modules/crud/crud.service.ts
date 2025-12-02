import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrudDto } from './dto/create-crud.dto';
import { UpdateCrudDto } from './dto/update-crud.dto';
import { Repository } from 'typeorm';
import { Crud } from './entities/crud.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CrudService {
  constructor(
    @InjectRepository(Crud) private readonly crudRepository: Repository<Crud>,
  ) {}
  async create(
    createCrudDto: CreateCrudDto,
  ): Promise<{ message: string; data: Crud }> {
    const crud = this.crudRepository.create(createCrudDto);
    const result = await this.crudRepository.save(crud);
    return {
      message: 'Crud created successfully',
      data: result,
    };
  }

  // async findAll(): Promise<{ message: string; data: Crud[] }> {
  //   const result = await this.crudRepository.find();
  //   return {
  //     message: 'Crud list retrieved successfully',
  //     data: result,
  //   };
  // }
  async findAll(filter, options) {
    const queryBuilder = await this.filterData(filter);
    const page = Number(options?.page) || 1;
    const limit = Number(options?.limit) || 10;

    const [items, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = {
      items,
      meta: {
        totalItems,
        // itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
    return {
      message: 'Crud list retrieved successfully',
      data: result,
    };
  }

  filterData = async (filter) => {
    const queryBuilder = this.crudRepository.createQueryBuilder('c');

    if (filter.id) {
      queryBuilder.andWhere('c.id = :id', {
        id: filter.id,
      });
    }
    if (filter.name) {
      queryBuilder.andWhere('c.name ILIKE :name', {
        name: `%${filter.name}%`,
      });
    }
    if (filter.description) {
      queryBuilder.andWhere('LOWER(c.description) LIKE LOWER(:description)', {
        description: `%${filter.description}%`,
      });
    }
    if(filter.created_at){
      queryBuilder.andWhere('DATE(c.createdAt) = :created_at',{
        created_at: filter.created_at
      })
    }
    queryBuilder.orderBy('c.id', 'DESC');

    return queryBuilder;
  };


  async findOne(id: number): Promise<{ message: string; data: Crud }> {
    const result = await this.crudRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException('Crud not found');
    }
    return {
      message: 'Crud retrieved successfully',
      data: result,
    };
  }

  async update(
    id: number,
    updateCrudDto: UpdateCrudDto,
  ): Promise<{ message: string; data: Crud }> {
    const crud = await this.crudRepository.findOneBy({ id });
    if (!crud) {
      throw new NotFoundException('Crud not found');
    }
    Object.assign(crud, updateCrudDto);
    const result = await this.crudRepository.save(crud);
    return {
      message: 'Crud updated successfully',
      data: result,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const crud = await this.crudRepository.findOneBy({ id });
    if (!crud) {
      throw new NotFoundException('Crud not found');
    }
    await this.crudRepository.delete(id);
    return {
      message: 'Crud deleted successfully',
    };
  }
}
