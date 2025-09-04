import { Server } from "socket.io";
import mongoose from "mongoose";
import Message from "../model/messages.model.js";
let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "https://hackmate-io.vercel.app"],
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log(`⚡ User connected: ${socket.id}`);
        socket.on("join_room", ({ teamId, userName }) => {
            socket.join(teamId);
            console.log(`👥 ${userName} joined room: ${teamId}`);
            io.to(teamId).emit("receive_message", {
                user: "System",
                message: `${userName} joined the chat`,
            });
        });
        socket.on("send_message", async ({ teamId, senderId, message, }) => {
            try {
                const newMessage = await Message.create({
                    team: new mongoose.Types.ObjectId(teamId),
                    sender: new mongoose.Types.ObjectId(senderId),
                    message,
                });
                io.to(teamId).emit("receive_message", {
                    _id: newMessage._id,
                    sender: senderId,
                    message: newMessage.message,
                    createdAt: newMessage.createdAt,
                });
            }
            catch (err) {
                console.error("Error saving message:", err);
            }
        });
        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });
    console.log("✅ Socket.IO initialized");
    return io;
};
export const getIO = () => {
    if (!io)
        throw new Error("Socket.IO not initialized!");
    return io;
};
