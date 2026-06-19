import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

/**
 * Centralized express-validator result handler.
 */
export const validate = (req, _res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const message = errors.array()[0]?.msg || "Validation failed";
        throw new ApiError(400, message, errors.array());
    }

    next();
};
