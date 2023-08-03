import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { RoomUser } from "./RoomUser";
import { RoomMessage } from "./RoomMessage";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RoomUser, (roomUser) => roomUser.user)
  rooms: RoomUser[];

  @OneToMany(() => RoomMessage, (roomMessage) => roomMessage.user)
  messages: RoomMessage[];
}
