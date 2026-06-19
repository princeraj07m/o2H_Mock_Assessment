import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

/**
 * Centralized error handler for consistent API error responses.
 */
export const errorHandler = (err, _req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err instanceof multer.MulterError) {
        statusCode = 400;
        message =
            err.code === "LIMIT_FILE_SIZE"
                ? "Image size must be less than 5MB"
                : err.message;
    } else if (err.message === "Only image files are allowed") {
        statusCode = 400;
    }

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyPattern || {})[0] || "field";
        message = `Duplicate value for ${field}`;
    }

    if (process.env.NODE_ENV !== "production") {
        console.error("[Error]", err);
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
};

/**
 * Handles requests to undefined routes.
 */
export const notFoundHandler = (_req, _res, next) => {
    next(new ApiError(404, "Route not found"));
};
