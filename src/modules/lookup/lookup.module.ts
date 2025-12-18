import { Module } from '@nestjs/common';
import { LookupService } from './services/lookup.service';
import { LookupTypeService } from './services/lookup-type.service';
import { LookupController } from './controllers/lookup.controller';
import { LookupTypeController } from './controllers/lookup-type.controller';
@Module({
  controllers: [LookupController,LookupTypeController],
  providers: [LookupService,LookupTypeService],
})
export class LookupModule {}
