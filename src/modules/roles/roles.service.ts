import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ){}
  async create(createRoleDto: CreateRoleDto):Promise<{ message: string; data: Role }> {
    const role = this.roleRepository.create(createRoleDto);
    const result = await this.roleRepository.save(role);
    return {
      message: 'Role created successfully',
      data: result,
    };
  }

  async findAll():Promise<{ message: string; data: Role[] }> {
    const result = await this.roleRepository.find();
    return {
      message: 'Roles retrieved successfully',
      data: result,
    };
  }

  async findOne(id: number):Promise<{ message: string; data: Role }> {
    const result = await this.roleRepository.findOneBy({ id });
    if (!result) {
      throw new NotFoundException('Role not found');
    }
    return {
      message: 'Role retrieved successfully',
      data: result,
    };
  }

  async update(id: number, updateRoleDto: UpdateRoleDto):Promise<{ message: string; data: Role }> {
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

  async remove(id: number):Promise<{ message: string }> {
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
