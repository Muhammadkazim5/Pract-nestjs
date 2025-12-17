import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLookupDto } from './dto/create-lookup.dto';
import { UpdateLookupDto } from './dto/update-lookup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lookup } from './entities/lookup.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LookupsService {
  constructor(@InjectRepository(Lookup) private readonly lookupRepository : Repository<Lookup>){}
  async create(createLookupDto: CreateLookupDto) {
    try{
      if (!createLookupDto || Object.keys(createLookupDto).length === 0) {
        throw new BadRequestException('Request body cannot be empty');
      }
      const lookup = this.lookupRepository.create(createLookupDto)
      return await this.lookupRepository.save(lookup)
    }catch(error){
      throw new BadRequestException('Failed to create lookup');
    }
  }

  findAll() {
    return `This action returns all lookups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lookup`;
  }

  update(id: number, updateLookupDto: UpdateLookupDto) {
    return `This action updates a #${id} lookup`;
  }

  remove(id: number) {
    return `This action removes a #${id} lookup`;
  }
}
