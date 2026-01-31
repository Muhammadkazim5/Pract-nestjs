import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  admin_id: number | null;

  @Column()
  action: string;

  @Column({ type: 'int', nullable: true })
  target_id: number | null;

  @Column({ nullable: true })
  target_type: string;

  @Column({ type: 'json', nullable: true })
  details: any;

  @CreateDateColumn()
  createdAt: Date;
}
