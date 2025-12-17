import { IsNotEmpty, IsString } from 'class-validator';
export class CreateLookupDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;
}
