import { body, param } from "express-validator";
import { TASK_PRIORITIES, TASK_STATUS } from "../../constants.js";

const statusValues = Object.values(TASK_STATUS);

export const createTaskValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters"),
    body("status")
        .optional()
        .isIn(statusValues)
        .withMessage("Status must be pending, in progress, or completed"),
    body("priority")
        .optional()
        .isIn(TASK_PRIORITIES)
        .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Due date must be in YYYY-MM-DD format"),
];

export const updateTaskValidator = [
    param("id").isMongoId().withMessage("Invalid task id"),
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),
    body("description")
        .optional()
        .trim()
        .isLength({ min: 20 })
        .withMessage("Description must be at least 20 characters"),
    body("status")
        .optional()
        .isIn(statusValues)
        .withMessage("Status must be pending, in progress, or completed"),
    body("priority")
        .optional()
        .isIn(TASK_PRIORITIES)
        .withMessage("Priority must be low, medium, or high"),
    body("dueDate")
        .optional()
        .matches(/^\d{4}-\d{2}-\d{2}$/)
        .withMessage("Due date must be in YYYY-MM-DD format"),
];

export const taskIdValidator = [
    param("id").isMongoId().withMessage("Invalid task id"),
];
