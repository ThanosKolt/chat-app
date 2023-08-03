import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RoomUser } from "./RoomUser";
import { RoomMessage } from "./RoomMessage";

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isGroup: boolean;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RoomUser, (roomUser) => roomUser.room)
  users: RoomUser[];

  @OneToMany(() => RoomMessage, (roomMessage) => roomMessage.chatRoom)
  messages: RoomMessage[];
}
