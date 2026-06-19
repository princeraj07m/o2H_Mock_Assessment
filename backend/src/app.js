import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import taskRouter from "./routes/task.routes.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { ensureDbConnection } from "./middlewares/db.middleware.js";

const app = express();

const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "https://o2-h-mock-assessment.vercel.app",
    "https://easify-khaki.vercel.app",
];

const envOrigins =
    process.env.CORS_ORIGIN?.trim() === "*"
        ? defaultOrigins
        : process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()).filter(Boolean) ||
          defaultOrigins;

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

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
            const isVercelOrigin = /^https:\/\/[\w-]+\.vercel\.app$/.test(origin);

            if (isLocalDevOrigin || isVercelOrigin) {
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
app.use(ensureDbConnection);

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
