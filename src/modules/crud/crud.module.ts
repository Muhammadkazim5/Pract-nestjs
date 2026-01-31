import { Module } from '@nestjs/common';
import { CrudService } from './crud.service';
import { CrudController } from './crud.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crud } from './entities/crud.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Crud]), AuditModule],
  controllers: [CrudController],
  providers: [CrudService],
})
export class CrudModule {}
