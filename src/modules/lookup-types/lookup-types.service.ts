import { Injectable } from '@nestjs/common';
import { CreateLookupTypeDto } from './dto/create-lookup-type.dto';
import { UpdateLookupTypeDto } from './dto/update-lookup-type.dto';

@Injectable()
export class LookupTypesService {
  create(createLookupTypeDto: CreateLookupTypeDto) {
    return 'This action adds a new lookupType';
  }

  findAll() {
    return `This action returns all lookupTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lookupType`;
  }

  update(id: number, updateLookupTypeDto: UpdateLookupTypeDto) {
    return `This action updates a #${id} lookupType`;
  }

  remove(id: number) {
    return `This action removes a #${id} lookupType`;
  }
}
