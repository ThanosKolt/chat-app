import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn()
  sender: User;

  @ManyToOne(() => Room, (room) => room.messages)
  @JoinColumn()
  room: Room;
}
