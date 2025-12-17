import { Module } from '@nestjs/common';
import { LookupsService } from './lookups.service';
import { LookupsController } from './lookups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lookup } from './entities/lookup.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Lookup])],
  controllers: [LookupsController],
  providers: [LookupsService],
})
export class LookupsModule {}
