import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Room } from "../entity/Room";
import { Message } from "../entity/Message";
import { StatusCodes } from "http-status-codes";

const manager = AppDataSource.manager;
const roomRepository = AppDataSource.getRepository(Room);

export const sendMessage = async (req: Request, res: Response) => {
  const { text, senderId, roomId } = req.body;
  const newMessage = new Message();
  newMessage.room = roomId;
  newMessage.sender = senderId;
  newMessage.text = text;
  await manager.save(newMessage);
  res.status(StatusCodes.OK).send();
};

export const getRoomMessages = async (req: Request, res: Response) => {
  const { roomId } = req.body;
  const room = await roomRepository.find({
    where: { id: roomId },
    relations: ["messages", "users", "messages.sender"],
  });
  const result = room[0].messages.map((message) => {
    let toId = room[0].users.filter((user) => user.id !== message.sender.id)[0]
      .id;
    return {
      text: message.text,
      fromId: message.sender.id,
      roomId: room[0].id,
      toId,
    };
  });

  res.json(result);
};
