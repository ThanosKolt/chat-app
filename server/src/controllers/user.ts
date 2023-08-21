import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import status from "http-status";
import { generateToken } from "../utils/jwt";
import { Like } from "typeorm";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/errors";
import { RequestBody } from "../types";

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
    throw new NotFoundError(`User with id: ${id} not found`);
  }
  res.status(status.OK).json(user);
};

export const udpateUser = async (req: Request, res: Response) => {
  const id: number = Number(req.params.id);
  const { username } = req.body;
  const user = await manager.findOneBy(User, { id });
  if (!user) {
    throw new NotFoundError(`No user found with id: ${id} found`);
  }
  const usernameExist = await manager.findOneBy(User, { username });
  if (usernameExist) {
    throw new BadRequestError(`This username is already being used`);
  }
  const response = await manager.update(User, { id }, { username });
  res.status(status.OK).json({ response });
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const user = await manager.findOneBy(User, { username });
  if (!user) {
    throw new NotFoundError(`No user with username: ${username} found`);
  }
  res.status(status.OK).json({ user });
};

export const register = async (req: RequestBody<Register>, res: Response) => {
  const { username, password } = req.body;
  const userExists = await manager.findOne(User, { where: { username } });
  if (userExists) {
    throw new BadRequestError(`user ${username} already exists`);
  }
  if (password.trim().length < 5) {
    throw new BadRequestError("password needs to be longer than 5 characters");
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
    throw new UnauthorizedError("Invalid Credentials");
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
    throw new NotFoundError(`User ${username} doesn't exist`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Wrong credentials");
  }

  const token = generateToken({ id: user.id, username: user.username });

  res
    .status(status.OK)
    .json({ user: { id: user.id, username: user.username }, token });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  await manager.delete(User, id);
  res.status(status.OK).json({ msg: "success" });
};

export const searchUser = async (req: Request, res: Response) => {
  const input: string = req.body.input;
  let result = await manager.find(User, {
    where: { username: Like(`%${input}%`) },
  });
  res.status(StatusCodes.OK).json(result);
};
