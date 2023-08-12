import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Room } from "../entity/Room";
import { StatusCodes } from "http-status-codes";
import { In, Not } from "typeorm";
import { BadRequestError, NotFoundError } from "../errors/errors";

const manager = AppDataSource.manager;

const roomRepository = AppDataSource.getRepository(Room);

export const createRoom = async (req: Request, res: Response) => {
  const userAId: number = Number(req.body.userAId);
  const userBId: number = Number(req.body.userBId);

  if (!userAId || !userBId) {
    throw new BadRequestError("You need to provide two user ids");
  }

  const isSelf = userAId === userBId;

  const doesRoomExist = await getRoom(userAId, userBId, isSelf);

  if (doesRoomExist !== null) {
    throw new BadRequestError(
      `This room already exists with id: ${doesRoomExist.id}`
    );
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
};

export const getRoomId = async (req: Request, res: Response) => {
  const userAId = Number(req.body.userAId);
  const userBId = Number(req.body.userBId);
  const isSelf = userAId === userBId;

  if (!userAId || !userBId) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { msg: "You need to provide two user ids" } });
    return;
  }
  const room = await getRoom(userAId, userBId, isSelf);
  if (room === null) {
    throw new NotFoundError(
      `Didnt find a chat room for users: ${userAId} ${userBId}`
    );
  }
  res.status(StatusCodes.OK).json({ roomId: room.id, users: room.users });
};

export const getRoomsByUser = async (req: Request, res: Response) => {
  const userId = Number(req.body.userId);
  const rooms = await roomRepository.find({
    where: { users: { id: userId } },
  });
  const roomsIds = rooms.map((room) => room.id);
  const roomsWithUsers = await roomRepository.find({
    where: { id: In(roomsIds), users: { id: Not(userId) } },
    relations: { users: true },
  });
  const result = roomsWithUsers.map((room) => {
    return {
      roomId: room.id,
      user: { id: room.users[0].id, username: room.users[0].username },
    };
  });
  res.status(StatusCodes.OK).json(result);
};

export const getRoomInfo = async (req: Request, res: Response) => {
  const roomId = Number(req.body.roomId);
  if (!roomId) {
    throw new BadRequestError("You need to provide a roomId");
  }
  const room = await roomRepository.findOne({
    relations: { users: true },
    where: { id: roomId },
  });
  if (room === null) {
    throw new NotFoundError(`Room with id: ${roomId} not found`);
  }
  const userResult = room.users.map((user) => {
    return { id: user.id, username: user.username };
  });
  res.status(StatusCodes.OK).json({ roomId: room.id, users: userResult });
  return;
};

const getRoom = async (userAId: number, userBId: number, isSelf: boolean) => {
  const roomsA = await roomRepository.find({
    where: { users: { id: userAId }, isSelf },
  });
  const roomsAIds = roomsA.map((room) => room.id);

  const doesRoomExist = await roomRepository.findOneBy({
    id: In(roomsAIds),
    users: { id: userBId },
  });
  return doesRoomExist;
};
