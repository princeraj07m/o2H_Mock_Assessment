import connectDB from "./db/index.js";
import { app } from "./app.js";
import { seedDemoUser } from "./utils/seedDemoUser.js";

connectDB()
    .then(async () => {
        await seedDemoUser();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });
