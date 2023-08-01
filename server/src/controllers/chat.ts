import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { ChatRoomRelation } from "../entity/ChatRoomRelation";
import status, { BAD_REQUEST } from "http-status";
import rm from "random-number";

const manager = AppDataSource.manager;

export const createRoom = async (req: Request, res: Response) => {
  const userAId: number = Number(req.params.userAId);
  const userBId: number = Number(req.params.userBId);
  if (!userAId || !userBId) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: "You need to provide two user ids" } });
    return;
  }
  const isSelf = userAId === userBId;
  const randomRoomId = rm({ min: 1000000000, max: 9999999999, integer: true });
  try {
    await manager.insert(ChatRoomRelation, {
      userAId,
      userBId,
      isSelf,
      roomId: randomRoomId,
    });
    const chatRoom = await manager.findOne(ChatRoomRelation, {
      where: { userAId, userBId },
    });
    if (chatRoom) {
      res.status(status.CREATED).json({ roomId: chatRoom.roomId });
    }
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wen't wrong" } });
  }
};

export const getChatRoomId = async (req: Request, res: Response) => {
  const userAId = Number(req.params.userAId);
  const userBId = Number(req.params.userBId);
  const isSelf = userAId === userBId;
  try {
    const chatRoom = await manager.findOne(ChatRoomRelation, {
      where: { userAId, userBId, isSelf },
    });
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
