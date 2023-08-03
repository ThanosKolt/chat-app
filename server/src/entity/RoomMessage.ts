import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ChatRoom } from "./Room";

@Entity()
export class RoomMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ChatRoom, (room) => room.messages)
  chatRoom: ChatRoom;

  @ManyToOne(() => User, (user) => user.messagesSent)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.messagesReceived)
  toUser: User;
}
