import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCrudDto } from './dto/create-crud.dto';
import { UpdateCrudDto } from './dto/update-crud.dto';
import { Repository } from 'typeorm';
import { Crud } from './entities/crud.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CrudService {
  constructor(@InjectRepository(Crud) private readonly crudRepository: Repository<Crud>){}
  async create(createCrudDto: CreateCrudDto): Promise<{ message: string; data: Crud }> {
    const crud =this.crudRepository.create(createCrudDto);
    const result = await this.crudRepository.save(crud);
    return {
      message: 'Crud created successfully',
      data: result,
    }
  }

  async findAll(): Promise<{ message: string; data: Crud[] }> {
    const result = await this.crudRepository.find();
    return {
      message: 'Crud list retrieved successfully',
      data: result,
    };
  }

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

  async update(id: number, updateCrudDto: UpdateCrudDto): Promise<{ message: string; data: Crud }> {
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
