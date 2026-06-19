import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );

        await User.syncIndexes();
        await Task.syncIndexes();

        console.log(
            `MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;