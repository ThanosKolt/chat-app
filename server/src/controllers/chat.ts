import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Room } from "../entity/Room";
import { StatusCodes } from "http-status-codes";
import { In, Not } from "typeorm";

const manager = AppDataSource.manager;

const roomRepository = AppDataSource.getRepository(Room);
const userRepository = AppDataSource.getRepository(User);

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
    const doesRoomExist = await getRoom(userAId, userBId, isSelf);

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
  try {
    const room = await getRoom(userAId, userBId, isSelf);
    if (!room) {
      res.status(StatusCodes.NOT_FOUND).json({
        error: {
          msg: `Didnt find a chat room for users: ${userAId} ${userBId}`,
        },
      });
      return;
    }
    res.status(StatusCodes.OK).json({ roomId: room.id, users: room.users });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { msg: "Something wen't wrong, please try again." } });
  }
};

export const getRoomsByUser = async (req: Request, res: Response) => {
  const userId = Number(req.body.userId);
  try {
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
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something wen't wrong" } });
  }
};

export const getRoomInfo = async (req: Request, res: Response) => {
  const roomId = Number(req.body.roomId);
  if (!roomId) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: { msg: `You need to provide a roomId` } });
    return;
  }
  try {
    const room = await roomRepository.findOne({
      relations: { users: true },
      where: { id: roomId },
    });
    if (room !== null) {
      const userResult = room.users.map((user) => {
        return { id: user.id, username: user.username };
      });
      res.status(StatusCodes.OK).json({ roomId: room.id, users: userResult });
      return;
    }
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `Room with id: ${roomId} not found` });
    return;
  } catch (error) {
    console.error(error.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something went wrong" } });
  }
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
