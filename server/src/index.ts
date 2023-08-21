import "reflect-metadata";
import "express-async-errors";
import { ConnectDb } from "./data-source";
import express from "express";
import { config } from "dotenv";
config();
import userRouter from "./routes/userRoute";
import messageRouter from "./routes/messageRoute";
import chatRouter from "./routes/chatRoute";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { MessageType } from "./types";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["get", "set"],
  },
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(errorHandler);

const port = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("user joined " + roomId);
  });

  socket.on("message", ({ fromId, roomId, text, toId }: MessageType) => {
    io.to(roomId).emit("message", { text, fromId, toId, roomId });
    console.log(fromId, toId, roomId, text);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

const main = async () => {
  try {
    await ConnectDb();

    server.listen(port, () => {
      console.log(`Server is listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error.message);
  }
};

main();
