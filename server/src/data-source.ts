import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Room } from "./entity/Room";
import { Message } from "./entity/Message";
import { config } from "dotenv";
config();

const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: "chat-app",
  synchronize: true,
  logging: false,
  entities: [User, Room, Message],
  migrations: [],
  subscribers: [],
});

export const ConnectDb = async () => {
  try {
    await AppDataSource.initialize();
    console.log("DB Connected");
  } catch (error) {
    console.error(error.message);
  }
};
