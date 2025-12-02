import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: User }> {
    try {
      let { roles, ...userData } = createUserDto;
      // Handle roles - convert single number to array if needed
      if (roles !== undefined) {
        if (typeof roles === 'number') {
          roles = [roles];
        }
      }

      const existingUser = await this.userRepository.findOneBy({
        email: userData.email,
      });
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
      }
      // 🔍 Find roles
      let roleEntities: Role[] = [];

      // 🔍 Fetch roles ONLY if roles were provided
      if (roles !== undefined) {
        roleEntities = await this.roleRepository.findBy({
          id: In(roles),
        });
        // If user sent roles that do NOT exist → throw error
        if (roleEntities.length !== roles.length) {
          throw new NotFoundException(`One or more roles do not exist`);
        }
      }

      // 🧩 Create user with roles
      const user = this.userRepository.create({
        ...userData,
        roles: roleEntities,
      });
      const result = await this.userRepository.save(user);
      return {
        message: 'User created successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(filter, options) {
    const queryBuilder = await this.filterData(filter);

    const page = Number(options?.page) || 1;
    const limit = Number(options?.limit) || 10;

    const [items, totalItems] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const itemsWithoutPassword = items.map(({ password, ...rest }) => rest);

    const result = {
      items: itemsWithoutPassword,
      meta: {
        totalItems,
        itemCount: itemsWithoutPassword.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };

    return {
      statusCode: HttpStatus.OK,
      message: 'User list retrieved successfully',
      result,
    };
  }

  filterData = async (filter) => {
    const queryBuilder = this.userRepository.createQueryBuilder('u');
    queryBuilder.leftJoinAndSelect('u.roles', 'roles');
    if (filter.id) {
      queryBuilder.andWhere('u.id = :id', { id: filter.id });
    }

    if (filter.name) {
      queryBuilder.andWhere('LOWER(u.name) LIKE LOWER(:name)', {
        name: `%${filter.name}%`,
      });
    }

    if (filter.email) {
      queryBuilder.andWhere('LOWER(u.email) LIKE LOWER(:email)', {
        email: `%${filter.email}%`,
      });
    }

    if (filter.phone) {
      queryBuilder.andWhere('LOWER(u.phone) LIKE LOWER(:phone)', {
        phone: `%${filter.phone}%`,
      });
    }

    if (filter.address) {
      queryBuilder.andWhere('LOWER(u.address) LIKE LOWER(:address)', {
        address: `%${filter.address}%`,
      });
    }

    if (filter.created_at) {
      queryBuilder.andWhere('DATE(u.createdAt) = :created_at', {
        created_at: filter.created_at,
      });
    }

    queryBuilder.orderBy('u.id', 'DESC');

    return queryBuilder;
  };

  async findOne(id: number): Promise<{ message: string; data: User }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  // async update(
  //   id: number,
  //   updateUserDto: UpdateUserDto,
  // ): Promise<{ message: string; data: User }> {
  //   const user = await this.userRepository.findOneBy({ id });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   const { roles: roleInput, ...userData } = updateUserDto;

  //   // Handle roles - convert single number to array if needed
  //   let userRoles: Role[] = [];
  //   if (roleInput !== undefined && roleInput !== null) {
  //     const roleIds = Array.isArray(roleInput) ? roleInput : [roleInput];
  //     if (roleIds.length > 0) {
  //       userRoles = await this.roleRepository.findBy({ id: In(roleIds) });
  //       if (userRoles.length !== roleIds.length) {
  //         throw new NotFoundException('One or more roles not found');
  //       }
  //     }
  //   }

  //   const result = this.userRepository.merge(user, {
  //     ...userData,
  //     roles: userRoles,
  //   });
  //   await this.userRepository.save(result);
  //   return {
  //     message: 'User updated successfully',
  //     data: result,
  //   };
  // }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; data: User }> {
    try {
      let { roles, email, ...updateData } = updateUserDto;
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['roles'], // important if you want to preserve existing roles
      });
      if (!user) {
        throw new NotFoundException(`User with this ${id} not found`);
      }
      // Handle roles - convert single number to array if needed
      let roleEntities: Role[] = [];
      if (roles !== undefined) {
        if (typeof roles === 'number') {
          roles = [roles];
        }
        roleEntities = await this.roleRepository.findBy({
          id: In(roles),
        });
      }
      const updatedUser = Object.assign(user, {
        ...updateData,
        ...(email && { email }),
        ...(roles !== undefined && { roles: roleEntities }),
      });

      // 💾 Save update
      const result = await this.userRepository.save(updatedUser);

      return {
        message: 'User updated successfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
