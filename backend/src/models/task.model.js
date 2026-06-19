import mongoose from "mongoose";
import { TASK_PRIORITIES, TASK_STATUS } from "../constants.js";

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            minlength: [20, "Description must be at least 20 characters"],
            trim: true,
        },
        status: {
            type: String,
            enum: {
                values: Object.values(TASK_STATUS),
                message: "Status must be pending, in progress, or completed",
            },
            default: TASK_STATUS.PENDING,
            index: true,
        },
        priority: {
            type: String,
            enum: {
                values: TASK_PRIORITIES,
                message: "Priority must be low, medium, or high",
            },
            default: "medium",
            index: true,
        },
        dueDate: {
            type: String,
            default: () => new Date().toISOString().split("T")[0],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ createdBy: 1, status: 1 });
taskSchema.index({ createdBy: 1, createdAt: -1 });
taskSchema.index({ title: "text", description: "text" });

export const Task = mongoose.model("Task", taskSchema);
