import { Module } from '@nestjs/common';
import { LookupTypesService } from './lookup-types.service';
import { LookupTypesController } from './lookup-types.controller';

@Module({
  controllers: [LookupTypesController],
  providers: [LookupTypesService],
})
export class LookupTypesModule {}
