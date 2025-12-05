import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from '../user/entities/user.entity';
import { paginate, IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<{ message: string; data: Post }> {
    try {
    const { userId, ...postData } = createPostDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const post = this.postRepository.create({ ...postData, user });
    const result = await this.postRepository.save(post);
    return {
      message: 'Post created successfully',
      data: result,
    };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(filter, options: IPaginationOptions): Promise<{ statusCode: HttpStatus; message: string; result: Pagination<Post> }> {
    const queryBuilder = await this.filterData(filter);
    const result = await paginate<Post>(queryBuilder, options);

    return {
      statusCode: HttpStatus.OK,
      message: 'Post list retrieved successfully',
      result,
    };
  }
  filterData = async (filter) => {
    const queryBuilder = this.postRepository.createQueryBuilder('p')
    .leftJoinAndSelect('p.user', 'user');

    if(filter.id){
      queryBuilder.andWhere('p.id = :id', {id: filter.id})
    }
    if(filter.title){
      queryBuilder.andWhere('LOWER(p.title) LIKE LOWER(:title)', {title: `%${filter.title}%`})
    }
    if(filter.content){
      queryBuilder.andWhere('LOWER(p.content) LIKE LOWER(:content)', {content: `%${filter.content}%`})
    }
    if(filter.created_at){
      queryBuilder.andWhere('DATE(p.createdAt) = :created_at', {created_at: filter.created_at})
    }
    queryBuilder.orderBy('p.id', 'DESC');
    return queryBuilder;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({where: {id}, relations: ['user']});
    if(!post){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({where: {id}, relations: ['user']});
    if(!post){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    const { userId, ...postData } = updatePostDto;
    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      post.user = user;
    }
    Object.assign(post, postData);
    const result = await this.postRepository.save(post);
    return {
      statusCode: HttpStatus.OK,
      message: 'Post updated successfully',
      data: result,
    };
  }

  async remove(id: number) {
    const post = await this.postRepository.findOneBy({id});
    if(!post){
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    await this.postRepository.delete(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Post deleted successfully',
    };
  }
}
