// import moment = require("moment");
import {
    BaseEntity,
    Column,
    DeleteDateColumn,
  } from 'typeorm';  
  export class DefaultEntity extends BaseEntity {
    @Column({ type: 'json', nullable: true })
    meta_data: any;

    // @Column({ nullable: true, type: 'text' })
    // notes: string;

    // @Column({ nullable: true })
    // status: number;
  
    @Column({ default: 1 })
    is_active: number;
  
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    created_at: string;
  
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    updated_at: string;
  
    @Column({ nullable: true })
    created_by: string;
  
    // @Column({nullable:true})
    user_ip: string;
  
    @Column({ nullable: true })
    updated_by: string;
  
    @DeleteDateColumn({ select: false })
    deleted_at: Date;
  }