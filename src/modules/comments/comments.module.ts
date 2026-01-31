import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { AuditModule } from '../audit/audit.module';
@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User]), AuditModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
