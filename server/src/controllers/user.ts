import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import status from "http-status";
import { generateToken } from "../utils/jwt";
import { Like } from "typeorm";
import { StatusCodes } from "http-status-codes";

interface RequestBody<T> extends Express.Request {
  body: T;
}

interface Register {
  username: string;
  password: string;
}

const manager = AppDataSource.manager;

export const getUsers = async (req: Request, res: Response) => {
  const users = await manager.find(User);
  res.status(status.OK).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const user = await manager.findOne(User, { where: { id } });
  if (!user) {
    res
      .status(status.NOT_FOUND)
      .json({ error: { msg: `No user with id: ${id} found` } });
    return;
  }
  res.status(status.OK).json(user);
};

export const udpateUser = async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const { username } = req.body;
  const user = await manager.findOneBy(User, { id });
  if (!user) {
    res
      .status(status.NOT_FOUND)
      .json({ error: { msg: `No user found with id: ${id} found` } });
    return;
  }
  const usernameExist = await manager.findOneBy(User, { username });
  if (usernameExist) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: `This username is already being used` } });
    return;
  }
  const response = await manager.update(User, { id }, { username });
  res.status(status.OK).json({ response });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await manager.findOneBy(User, { username });
  if (!user) {
    res
      .status(status.NOT_FOUND)
      .json({ error: { msg: `No user with username: ${username} found` } });
    return;
  }
  res.status(status.OK).json({ user });
};

export const register = async (req: RequestBody<Register>, res: Response) => {
  const { username, password } = req.body;
  const userExists = await manager.findOne(User, { where: { username } });
  if (userExists) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: `user ${username} already exists` } });
    return;
  }
  if (password.trim().length < 5) {
    res.status(status.BAD_REQUEST).json({
      error: { msg: "password needs to be longer than 5 characters" },
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await manager.insert(User, { username, password: hashedPassword });
  const user = await manager.findOne(User, {
    where: { username },
  });
  res.status(status.CREATED).json({ user });
};

export const login = async (req: RequestBody<Register>, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: "Invalid Credentials" } });
    return;
  }
  const user = await manager.findOne(User, {
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });
  if (!user) {
    res
      .status(status.BAD_REQUEST)
      .json({ error: { msg: `User ${username} doesn't exist` } });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    res.status(status.UNAUTHORIZED).json("wrong credentials");
    return;
  }

  const token = generateToken({ id: user.id, username: user.username });

  res
    .status(status.OK)
    .json({ user: { id: user.id, username: user.username }, token });
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await manager.delete(User, id);
    res.status(status.OK).json({ msg: "success" });
  } catch (error) {
    res.status(status.INTERNAL_SERVER_ERROR).json({ msg: "delete failed" });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const input: string = req.body.input;
    let result = await manager.find(User, {
      where: { username: Like(`%${input}%`) },
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: { msg: "Something went wrong" } });
  }
};
