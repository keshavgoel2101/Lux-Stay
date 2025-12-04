import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import hotelRoutes from "./routes/hotel.routes.js";
import roomRoutes from "./routes/room.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/reservations", reservationRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const PORT = env.PORT;

// Graceful shutdown
process.on("SIGINT", async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await disconnectDatabase();
  process.exit(0);
});

// Start server
async function startServer() {
  await connectDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API available at http://localhost:${PORT}/api`);
  });
}

startServer();

