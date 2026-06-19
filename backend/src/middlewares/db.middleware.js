import mongoose from "mongoose";
import connectDB from "../db/index.js";
import { seedDemoUser } from "../utils/seedDemoUser.js";

let isInitialized = false;

export const ensureDbConnection = async (_req, _res, next) => {
    try {
        if (!isInitialized) {
            await connectDB({ serverless: !!process.env.VERCEL });
            await seedDemoUser();
            isInitialized = true;
        } else if (mongoose.connection.readyState !== 1) {
            await connectDB({ serverless: !!process.env.VERCEL });
        }

        next();
    } catch (error) {
        next(error);
    }
};
