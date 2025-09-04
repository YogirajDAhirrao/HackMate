import mongoose from "mongoose";
import { createServer } from "http";
import app from "./app.js";
import { initSocket } from "./config/socket.js";
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
const server = createServer(app); // ✅ One server for both Express + Socket.IO
// Initialize Socket.IO
initSocket(server);
// Connect MongoDB & Start Server
mongoose
    .connect(MONGO_URI)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});
