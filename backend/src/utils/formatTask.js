/**
 * Maps a Mongoose task document to the API response shape expected by the frontend.
 */
export const formatTask = (task) => {
    if (!task) return null;

    return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        userId: task.createdBy?.toString?.() || task.createdBy?.toString(),
    };
};
