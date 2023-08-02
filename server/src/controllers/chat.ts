import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { ChatRoomRelation } from "../entity/ChatRoomRelation";
import status, { BAD_REQUEST } from "http-status";
import rm from "random-number";

const manager = AppDataSource.manager;

const chatRepository = AppDataSource.getRepository(ChatRoomRelation);

export const createRoom = async (req: Request, res: Response) => {
  const userAId: number = Number(req.body.userAId);
  const userBId: number = Number(req.body.userBId);
  if (!userAId || !userBId) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: "You need to provide two user ids" } });
    return;
  }
  const isSelf = userAId === userBId;
  const randomRoomId = rm({ min: 1000000000, max: 2147483646, integer: true });
  try {
    const chatRoomExists = await manager.findOne(ChatRoomRelation, {
      where: {
        userAId: userAId || userBId,
        userBId: userAId || userBId,
        isSelf,
      },
    });
    if (chatRoomExists !== null) {
      res.status(status.BAD_REQUEST).json({
        error: {
          msg: "Chat room already exists",
        },
      });
      return;
    }
    await manager.insert(ChatRoomRelation, {
      userAId,
      userBId,
      isSelf,
      roomId: randomRoomId,
    });
    const chatRoom = await manager.findOne(ChatRoomRelation, {
      where: {
        userAId: userAId || userBId,
        userBId: userAId || userBId,
        isSelf,
      },
    });
    if (chatRoom) {
      res.status(status.CREATED).json({ roomId: chatRoom.roomId });
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wen't wrong" } });
    console.log(error.message);
  }
};

export const getChatRoomId = async (req: Request, res: Response) => {
  const userAId = Number(req.body.userAId);
  const userBId = Number(req.body.userBId);
  const isSelf = userAId === userBId;

  if (!userAId || !userBId) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: "You need to provide two user ids" } });
    return;
  }
  try {
    const chatRoom = await chatRepository
      .createQueryBuilder("chat")
      .select()
      .where("chat.userAId = :userAId OR chat.userAId = :userBId", {
        userAId,
        userBId,
      })
      .where("chat.userBId = :userAId OR chat.userBId = :userBId", {
        userAId,
        userBId,
      })
      .where("chat.isSelf = :isSelf", { isSelf })
      .getOne();
    if (!chatRoom) {
      res.status(status.NOT_FOUND).json({
        error: {
          msg: `Didnt find a chat room for users: ${userAId} ${userBId}`,
        },
      });
      return;
    }
    res.status(status.OK).json({ roomId: chatRoom.roomId });
  } catch (error) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: "Something wen't wrong, please try again." } });
  }
};
