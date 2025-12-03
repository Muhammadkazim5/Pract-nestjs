import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Comment } from 'src/modules/comments/entities/comment.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true, select: false })
  @Exclude()
  password: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  phone: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @ManyToMany(() => Role, { eager: false, onDelete: "CASCADE" })
  @JoinTable({
    name: "users_roles",
    joinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];

  @OneToMany(()=> Post,(post) => post.user)
  posts: Post[];

  @OneToMany(()=> Comment,(comment)=>comment.user)
  comments: Comment[];
}
