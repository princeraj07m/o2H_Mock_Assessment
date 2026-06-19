import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { TASK_STATUS } from "../constants.js";

/**
 * Ensures demo account and sample tasks exist for frontend onboarding.
 */
export const seedDemoUser = async () => {
    const email = "john@example.com";
    let user = await User.findOne({ email });

    if (!user) {
        user = await User.create({
            name: "John Doe",
            email,
            password: "password",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
            coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800",
            bio: "SaaS product manager & frontend enthusiast.",
        });
        console.log("Demo user ready: john@example.com / password");
    }

    const existingTasks = await Task.countDocuments({ createdBy: user._id });
    if (existingTasks > 0) {
        return;
    }

    const today = new Date();
    const day = (offset) =>
        new Date(today.getTime() + offset * 86400000).toISOString().split("T")[0];

    await Task.insertMany([
        {
            title: "Design onboarding flow",
            description:
                "Create high-fidelity wireframes and user journeys for the new workspace activation flow in Figma.",
            status: TASK_STATUS.IN_PROGRESS,
            priority: "high",
            dueDate: day(2),
            createdBy: user._id,
        },
        {
            title: "Setup Vite + React Router",
            description:
                "Initialize a clean project repository, install dependencies, and configure routes for dashboard layouts.",
            status: TASK_STATUS.COMPLETED,
            priority: "medium",
            dueDate: day(0),
            createdBy: user._id,
        },
        {
            title: "Review pull request #108",
            description:
                "Review the backend schema changes for collaborative real-time editing feature.",
            status: TASK_STATUS.PENDING,
            priority: "low",
            dueDate: day(5),
            createdBy: user._id,
        },
    ]);

    console.log("Demo tasks seeded for john@example.com");
};
