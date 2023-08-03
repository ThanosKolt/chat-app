import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { User } from "./User";

@Entity()
export class RoomUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, (room) => room.users)
  room: Room;

  @ManyToOne(() => User, (user) => user.rooms)
  user: User;
}
