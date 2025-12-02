import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
 constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
 ){}
  // hash password
  async hashPassword(password: string) {
   return await bcrypt.hash(password, 10);
  }

  // compare password
  async comparePassword(password: string, hash: string) {
   return await bcrypt.compare(password, hash);
  }

 async signUp(signUpDto: SignUpDto): Promise<{ message: string; data: User }> {
  const existingEmail = await this.userRepository.findOne({
    where: { email: signUpDto.email },
  });

  if (existingEmail) {
    throw new ConflictException('This email address is already registered.');
  }
    const user = this.userRepository.create({
      ...signUpDto,
      password: await this.hashPassword(signUpDto.password),
      roles: [{ id: 3 }],
    });
    const result = await this.userRepository.save(user);
    return {
      message: 'Signed up successfully!',
      data: result,
    };
 }

 async signIn(signInDto: SignInDto): Promise<any> {
  const { email, password } = signInDto;
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }
    if (!user.password) {
      throw new NotFoundException('Invalid credentials');
    }
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }
    const payload: JwtPayload = { email };
    const accessToken: string = this.jwtService.sign(payload);
    return {
      message: 'Logged in successfully!',
      data: { ...user, accessToken: accessToken },
    };
 }
 async getProfile(id: number): Promise<{ message: string; data: User }> {
  const user = await this.userRepository.findOne({ where:{ id },  relations: ['roles'] });
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return {
    message: 'Profile retrieved successfully',
    data: user,
  };
 }
}
