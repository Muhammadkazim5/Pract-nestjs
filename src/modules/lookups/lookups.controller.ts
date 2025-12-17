import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LookupsService } from './lookups.service';
import { CreateLookupDto } from './dto/create-lookup.dto';
import { UpdateLookupDto } from './dto/update-lookup.dto';

@Controller('lookups')
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @Post()
  create(@Body() createLookupDto: CreateLookupDto) {
    return this.lookupsService.create(createLookupDto);
  }

  @Get()
  findAll() {
    return this.lookupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lookupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLookupDto: UpdateLookupDto) {
    return this.lookupsService.update(+id, updateLookupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lookupsService.remove(+id);
  }
}
