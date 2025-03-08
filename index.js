import express from "express";
import helmet from "helmet";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Server } from "socket.io";
import http from "http";
import knex from "./database/connection.js";
import { PORT } from "./config/env.config.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import setupSocketEvents from "./config/socket.config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(helmet()); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/utils", express.static(path.join(__dirname, "utils")));

// Routes
app.use(router);
app.use((_req, _res, next) => next(new Error("404 Not Found")));

// Global error handler
app.use(errorMiddleware);

try {
  await knex.raw("SELECT 1"); // Verify DB connection
  server.listen(PORT, () => {
    setupSocketEvents(io);
    console.log(`Remote Keyboard server running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error("Database connection error:", err);
  process.exit(1); // Exit process if DB connection fails
}

export default app;
