import jwt, { Secret } from "jsonwebtoken";
import { config } from "dotenv";
config();

interface payload {
  id: number;
  username: string;
}

export function generateToken(payload: payload) {
  const secret: Secret = process.env.JWT_SECRET!;
  const token = jwt.sign({ payload }, secret, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
}
