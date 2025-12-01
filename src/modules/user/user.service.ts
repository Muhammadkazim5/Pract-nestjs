import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: User }> {
    const user = this.userRepository.create(createUserDto);
    const result = await this.userRepository.save(user);
    return {
      message: 'User created successfully',
      data: result,
    };
  }

  async findAll(): Promise<{ message: string; data: User[] }> {
    const users = await this.userRepository.find();
    return {
      message: 'User list retrieved successfully',
      data: users,
    };
  }

  async findOne(id: number): Promise<{ message: string; data: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto):Promise<{ message: string; data: User }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // const result=this.userRepository.update(id,updateUserDto);
    // Object.assign(user, updateUserDto);
    // const result = await this.userRepository.save(user);
    const result = this.userRepository.merge(user, updateUserDto);
    await this.userRepository.save(result);
    return {
      message: 'User updated successfully',
      data: result,
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.userRepository.delete(id);
    return {
      message: 'User deleted successfully',
    }
  }
}
