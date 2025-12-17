import { Module } from '@nestjs/common';
import { CrudModule } from './modules/crud/crud.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/db';
import { AuthModule } from './modules/auth/auth.module';
import { RolesModule } from './modules/roles/roles.module';
import { PostModule } from './modules/post/post.module';
import { CommentsModule } from './modules/comments/comments.module';
import { LookupsModule } from './modules/lookups/lookups.module';
import { LookupTypesModule } from './modules/lookup-types/lookup-types.module';

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
    AuthModule,
    RolesModule,
    PostModule,
    CommentsModule,
    LookupsModule,
    LookupTypesModule,
  ],
})
export class AppModule {}
