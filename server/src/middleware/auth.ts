import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/errors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";

interface UserPayload {
  payload: {
    id: number;
    username: string;
  };
  exp: number;
  iat: number;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const headers = req.headers.authorization;
  if (headers === null || !headers?.startsWith("Bearer")) {
    throw new UnauthorizedError("Invalid Token");
  }
  const token = headers.split(" ")[1];
  try {
    const {
      payload: { id, username },
      exp,
      iat,
    } = jwt.verify(
      token,
      process.env.jwt_secret! || "MISSING_SECRET"
    ) as UserPayload;
    req.user = { id, username };
  } catch (error) {
    throw new UnauthorizedError("Invalid Token");
  }
  next();
};
