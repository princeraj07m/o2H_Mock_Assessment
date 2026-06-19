import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN?.trim() || "http://localhost:5173";
const allowedOrigins =
    corsOrigin === "*"
        ? ["http://localhost:5173", "http://127.0.0.1:5173"]
        : corsOrigin.split(",").map((origin) => origin.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                callback(null, true);
                return;
            }

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
                return;
            }

            const isLocalDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
            if (process.env.NODE_ENV !== "production" && isLocalDevOrigin) {
                callback(null, true);
                return;
            }

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
    express.json({
        limit: "1mb",
    })
);
app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb",
    })
);
app.use(cookieParser());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Management API is running",
    });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
