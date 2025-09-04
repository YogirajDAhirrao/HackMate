import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import Message from "../model/messages.model.js";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://hackmate-io.vercel.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.id}`);

    // ✅ Join room
    socket.on("join_room", ({ teamId, userName }) => {
      socket.join(teamId);
      console.log(`👥 ${userName} joined room: ${teamId}`);

      io.to(teamId).emit("receive_message", {
        user: "System",
        message: `${userName} joined the chat`,
        createdAt: new Date(),
      });
    });

    // ✅ Leave room
    socket.on("leave_room", ({ teamId, userName }) => {
      socket.leave(teamId);
      console.log(`🚪 ${userName} left room: ${teamId}`);

      io.to(teamId).emit("receive_message", {
        user: "System",
        message: `${userName} left the chat`,
        createdAt: new Date(),
      });
    });

    // ✅ Send message
    socket.on(
      "send_message",
      async ({
        teamId,
        senderId,
        message,
      }: {
        teamId: string;
        senderId: string;
        message: string;
      }) => {
        try {
          const newMessage = await Message.create({
            team: new mongoose.Types.ObjectId(teamId),
            sender: new mongoose.Types.ObjectId(senderId),
            message,
          });

          // ✅ Populate sender details
          const populatedMessage = await newMessage.populate("sender", "name");

          // ✅ Send full message object to all clients
          io.to(teamId).emit("receive_message", populatedMessage);
        } catch (err) {
          console.error("Error saving message:", err);
        }
      }
    );

    // ✅ Disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  console.log("✅ Socket.IO initialized");
  return io;
};

export const getIO = (): Server => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};
