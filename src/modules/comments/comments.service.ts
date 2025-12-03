import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(createCommentDto: CreateCommentDto) {
    const { userId, postId, ...commentData } = createCommentDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    const comment = this.commentRepository.create({
      ...commentData,
      user,
      post,
    });
    const result = await this.commentRepository.save(comment);
    return {
      message: 'Comment created successfully',
      data: result,
    };
  }

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
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
    return {
      message: 'Comments retrieved successfully',
      data: result,
    };
  }

  filterData = async (filter) => {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('co')
      .leftJoinAndSelect('co.post', 'post')
      .leftJoinAndSelect('co.user', 'user');

    if (filter.id) {
      queryBuilder.andWhere('co.id = :id', { id: filter.id });
    }
    if (filter.comment) {
      queryBuilder.andWhere('co.comment = :comment', {
        comment: filter.comment,
      });
    }
    if (filter.created_at) {
      queryBuilder.andWhere('DATE(co.createdAt) = :created_at', {
        created_at: filter.created_at,
      });
    }
    queryBuilder.orderBy('co.id', 'DESC');
    return queryBuilder;
  };
  async findOne(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return {
      message: 'Comment retrieved successfully',
      data: comment,
    };
    return `This action returns a #${id} comment`;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    const { userId, postId, ...commentData } = updateCommentDto;
    if (userId) {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      comment.user = user;
    }
    if (postId) {
      const post = await this.postRepository.findOneBy({ id: postId });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      comment.post = post;
    }
    Object.assign(comment, commentData);
    const result = await this.commentRepository.save(comment);
    return {
      message: 'Comment updated successfully',
      data: result,
    };
  }

  remove(id: number) {
    const comment = this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    this.commentRepository.delete(id);
    return {
      message: 'Comment deleted successfully',
    };
  }
}
