import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LookupTypesService } from './lookup-types.service';
import { CreateLookupTypeDto } from './dto/create-lookup-type.dto';
import { UpdateLookupTypeDto } from './dto/update-lookup-type.dto';

@Controller('lookup-types')
export class LookupTypesController {
  constructor(private readonly lookupTypesService: LookupTypesService) {}

  @Post()
  create(@Body() createLookupTypeDto: CreateLookupTypeDto) {
    return this.lookupTypesService.create(createLookupTypeDto);
  }

  @Get()
  findAll() {
    return this.lookupTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lookupTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLookupTypeDto: UpdateLookupTypeDto) {
    return this.lookupTypesService.update(+id, updateLookupTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lookupTypesService.remove(+id);
  }
}
