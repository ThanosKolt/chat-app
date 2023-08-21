import { Request } from "express";

export interface MessageType {
  text: string;
  fromId: number;
  toId: number;
  roomId: string;
}

export interface ICustomError {
  message: string;
  name: string;
  status: number;
}

export interface RequestBody<T> extends Express.Request {
  body: T;
}
