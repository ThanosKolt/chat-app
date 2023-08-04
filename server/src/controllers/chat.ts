import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Room } from "../entity/Room";
import { StatusCodes } from "http-status-codes";
import rm from "random-number";
import { In } from "typeorm";

const manager = AppDataSource.manager;

const roomRepository = AppDataSource.getRepository(Room);

export const createRoom = async (req: Request, res: Response) => {
  const userAId: number = Number(req.body.userAId);
  const userBId: number = Number(req.body.userBId);

  if (!userAId || !userBId) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { msg: "You need to provide two user ids" } });
    return;
  }

  const isSelf = userAId === userBId;

  try {
    const roomsA = await roomRepository.find({
      where: { users: { id: userAId }, isSelf },
    });
    const roomsAIds = roomsA.map((room) => room.id);

    const doesRoomExist = await roomRepository.findOneBy({
      id: In(roomsAIds),
      users: { id: userBId },
    });

    if (doesRoomExist !== null) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: { msg: `This room already exists with id: ${doesRoomExist.id}` },
      });
      return;
    }

    const userA = await manager.findOneBy(User, { id: userAId });
    const userB = await manager.findOneBy(User, { id: userBId });

    const newRoom = new Room();
    if (userA !== null && userB !== null) {
      newRoom.isSelf = isSelf;
      newRoom.users = [userA, userB];
      await manager.save(newRoom);
    }
    res.status(StatusCodes.CREATED).json({ roomId: newRoom.id });
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "something went wrong." } });
  }
};

// export const getChatRoomId = async (req: Request, res: Response) => {
//   const userAId = Number(req.body.userAId);
//   const userBId = Number(req.body.userBId);
//   const isSelf = userAId === userBId;

//   if (!userAId || !userBId) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: { msg: "You need to provide two user ids" } });
//     return;
//   }
//   try {
//     const chatRoom = await returnChatRoom(userAId, userBId, isSelf);
//     if (!chatRoom) {
//       res.status(StatusCodes.NOT_FOUND).json({
//         error: {
//           msg: `Didnt find a chat room for users: ${userAId} ${userBId}`,
//         },
//       });
//       return;
//     }
//     res.status(StatusCodes.OK).json({ roomId: chatRoom.roomId });
//   } catch (error) {
//     res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: { msg: "Something wen't wrong, please try again." } });
//   }
// };

const returnChatRoom = (userAId: number, userBId: number, isSelf: boolean) => {
  return roomRepository
    .createQueryBuilder("chat")
    .select()
    .where("chat.userAId = :userAId OR chat.userAId = :userBId")
    .where("chat.userBId = :userAId OR chat.userBId = :userBId")
    .where("chat.isSelf = :isSelf")
    .setParameters({ userAId, userBId, isSelf })
    .getOne();
};
