import { Module } from '@nestjs/common';
import { CrudModule } from './modules/crud/crud.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/db';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    CrudModule,
    UserModule,
  ],
})
export class AppModule {}
