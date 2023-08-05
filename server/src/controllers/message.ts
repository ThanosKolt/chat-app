import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Room } from "../entity/Room";
import { Message } from "../entity/Message";
import { StatusCodes } from "http-status-codes";
import { MessageType } from "src/types";

const manager = AppDataSource.manager;
const userRepository = AppDataSource.getRepository(User);
const roomRepository = AppDataSource.getRepository(Room);
const messageRepository = AppDataSource.getRepository(Message);

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, senderId, roomId } = req.body;
    const newMessage = new Message();
    newMessage.room = roomId;
    newMessage.sender = senderId;
    newMessage.text = text;
    await manager.save(newMessage);
    res.status(StatusCodes.OK).send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "something went wrong" } });
  }
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
