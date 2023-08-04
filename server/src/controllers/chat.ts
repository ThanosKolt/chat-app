import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { ChatRoomRelation } from "../entity/ChatRoomRelation";
import status from "http-status";
import rm from "random-number";
import { Room } from "../entity/Room";

const manager = AppDataSource.manager;

// const chatRepository = AppDataSource.getRepository(ChatRoomRelation);
const userRepository = AppDataSource.getRepository(User);
const roomRepository = AppDataSource.getRepository(Room);

export const createRoom = async (req: Request, res: Response) => {
  const userAId: number = Number(req.body.userAId);
  const userBId: number = Number(req.body.userBId);
  if (!userAId || !userBId) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: "You need to provide two user ids" } });
    return;
  }
  try {
    const doesRoomExists = await getChatRoom(userAId, userBId);
    if (doesRoomExists) {
      res.status(status.BAD_REQUEST).json({
        error: { msg: `room already exists with id:${doesRoomExists.id}` },
      });
      return;
    }
    const userA = await manager.findOneBy(User, { id: userAId });
    const userB = await manager.findOneBy(User, { id: userBId });
    const newRoom = new Room();
    if (userA !== null && userB !== null) {
      newRoom.users = [userA, userB];
      newRoom.isSelf = userAId === userBId;
      roomRepository.save(newRoom);
    }
    res.status(status.CREATED).json({ roomId: newRoom.id });
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "something went wrong " } });
  }
};

// export const createRoom = async (req: Request, res: Response) => {
//   const userAId: number = Number(req.body.userAId);
//   const userBId: number = Number(req.body.userBId);
//   if (!userAId || !userBId) {
//     res
//       .status(status.BAD_REQUEST)
//       .json({ error: { msg: "You need to provide two user ids" } });
//     return;
//   }
//   const isSelf = userAId === userBId;
//   const randomRoomId = rm({ min: 1000000000, max: 2147483646, integer: true });
//   try {
//     const chatRoomExists = await returnChatRoom(userAId,userBId,isSelf);
//     if (chatRoomExists !== null) {
//       res.status(status.BAD_REQUEST).json({
//         error: {
//           msg: "Chat room already exists",
//         },
//       });
//       return;
//     }
//     await manager.insert(ChatRoomRelation, {
//       userAId,
//       userBId,
//       isSelf,
//       roomId: randomRoomId,
//     });
//     const chatRoom = await returnChatRoom(userAId,userBId,isSelf);
//     if (chatRoom) {
//       res.status(status.CREATED).json({ roomId: chatRoom.roomId });
//     }
//   } catch (error) {
//     res
//       .status(status.INTERNAL_SERVER_ERROR)
//       .json({ error: { msg: "Something wen't wrong" } });
//     console.log(error.message);
//   }
// };

// export const getChatRoomId = async (req: Request, res: Response) => {
//   const userAId = Number(req.body.userAId);
//   const userBId = Number(req.body.userBId);
//   const isSelf = userAId === userBId;

//   if (!userAId || !userBId) {
//     res
//       .status(status.BAD_REQUEST)
//       .json({ error: { msg: "You need to provide two user ids" } });
//     return;
//   }
//   try {
//     const chatRoom = await returnChatRoom(userAId, userBId, isSelf);
//     if (!chatRoom) {
//       res.status(status.NOT_FOUND).json({
//         error: {
//           msg: `Didnt find a chat room for users: ${userAId} ${userBId}`,
//         },
//       });
//       return;
//     }
//     res.status(status.OK).json({ roomId: chatRoom.roomId });
//   } catch (error) {
//     res
//       .status(status.BAD_REQUEST)
//       .json({ error: { msg: "Something wen't wrong, please try again." } });
//   }
// };

// const returnChatRoom = (userAId: number, userBId: number, isSelf: boolean) => {
//   return chatRepository
//     .createQueryBuilder("chat")
//     .select()
//     .where("chat.userAId = :userAId OR chat.userAId = :userBId")
//     .where("chat.userBId = :userAId OR chat.userBId = :userBId")
//     .where("chat.isSelf = :isSelf")
//     .setParameters({ userAId, userBId, isSelf })
//     .getOne();
// };

const getChatRoom = async (userAId: number, userBId: number) => {
  const isSelf = userAId === userBId;
  const room = await roomRepository.find({
    where: { isSelf },
    relations: ["users"],
  });
  const roomExists = room.find((room) => {
    return (
      room.users.find((user) => user.id === userAId) &&
      room.users.find((user) => user.id === userBId)
    );
  });
  return roomExists;
};
