import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

const connectDB = async ({ serverless = false } = {}) => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGODB_URI) {
        const message = "MONGODB_URI is not defined in environment variables";
        console.error(message);
        if (serverless || process.env.VERCEL) {
            throw new Error(message);
        }
        process.exit(1);
    }

    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`,
            {
                serverSelectionTimeoutMS: 10000,
            }
        );

        await User.syncIndexes();
        await Task.syncIndexes();

        console.log(
            `MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
        );

        return connectionInstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        if (serverless || process.env.VERCEL) {
            throw error;
        }
        process.exit(1);
    }
};

export default connectDB;
