import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/errors";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CustomError) {
    return res.status(err.status).json({ error: { message: err.message } });
  }
  console.log("error:" + err.message);
  return res.status(500).json({ error: { message: "something went worng" } });
}
