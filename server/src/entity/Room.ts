import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isGroup: boolean;

  @Column({ default: false })
  isSelf: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, (users) => users.rooms, { cascade: true })
  @JoinTable()
  users: User[];
}
