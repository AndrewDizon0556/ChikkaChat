import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { auth } from "../config/firebase";
import User from "../models/User";
import { registerMessageHandlers } from "./handlers";

const onlineUsers = new Map<string, string>();

export const initializeSocket = (httpServer: HttpServer): Server => {
  const allowedOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
  ].filter(Boolean) as string[];

  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = await auth.verifyIdToken(token);
      const user = await User.findOne({ firebase_uid: decoded.uid });
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.data.userId = user._id.toString();
      socket.data.firebaseUid = decoded.uid;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    console.log(`User connected: ${userId}`);

    onlineUsers.set(userId, socket.id);

    User.findByIdAndUpdate(userId, { status: "online" }).exec();

    io.emit("user:status", { userId, status: "online" });

    socket.on("conversation:join", (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(conversationId);
    });

    socket.on("typing:start", (conversationId: string) => {
      socket.to(conversationId).emit("typing:update", {
        userId,
        conversationId,
        isTyping: true,
      });
    });

    socket.on("typing:stop", (conversationId: string) => {
      socket.to(conversationId).emit("typing:update", {
        userId,
        conversationId,
        isTyping: false,
      });
    });

    registerMessageHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId);

      User.findByIdAndUpdate(userId, {
        status: "offline",
        last_seen: new Date(),
      }).exec();

      io.emit("user:status", { userId, status: "offline" });
    });
  });

  return io;
};

export { onlineUsers };
