import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
import { TASK_STATUS } from "../constants.js";
import { formatTask } from "../utils/formatTask.js";

const priorityOrder = { low: 1, medium: 2, high: 3 };

const buildTaskStats = (tasks) => {
    const pendingTasks = tasks.filter((task) => task.status === TASK_STATUS.PENDING).length;
    const inProgressTasks = tasks.filter((task) => task.status === TASK_STATUS.IN_PROGRESS).length;
    const completedTasks = tasks.filter((task) => task.status === TASK_STATUS.COMPLETED).length;

    return {
        totalTasks: tasks.length,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        total: tasks.length,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        completed: completedTasks,
    };
};

const buildSortOptions = (query) => {
    const sortBy = query.sortBy || query.sort?.replace(/^-/, "") || "createdAt";
    const sortOrder =
        query.sortOrder ||
        (query.sort?.startsWith("-") ? "desc" : "asc");

    const direction = sortOrder === "desc" ? -1 : 1;

    if (sortBy === "priority") {
        return { priority: direction };
    }

    if (sortBy === "dueDate") {
        return { dueDate: direction };
    }

    return { createdAt: direction };
};

const sortTasksInMemory = (tasks, query) => {
    const sortBy = query.sortBy || query.sort?.replace(/^-/, "") || "createdAt";
    const sortOrder = query.sortOrder || (query.sort?.startsWith("-") ? "desc" : "asc");
    const direction = sortOrder === "desc" ? -1 : 1;

    return [...tasks].sort((a, b) => {
        if (sortBy === "dueDate") {
            return (new Date(a.dueDate || 0) - new Date(b.dueDate || 0)) * direction;
        }

        if (sortBy === "priority") {
            return (priorityOrder[a.priority] - priorityOrder[b.priority]) * direction;
        }

        return (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)) * direction;
    });
};

const createTask = asyncHandler(async (req, res) => {
    const task = await Task.create({
        ...req.body,
        createdBy: req.user._id,
    });

    return res.status(201).json(formatTask(task));
});

const getAllTasks = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const userFilter = { createdBy: req.user._id };
    const userTasks = await Task.find(userFilter).lean();
    const stats = buildTaskStats(userTasks);

    const filter = { ...userFilter };

    if (req.query.status && req.query.status !== "all") {
        filter.status = req.query.status;
    }

    if (req.query.priority && req.query.priority !== "all") {
        filter.priority = req.query.priority;
    }

    if (req.query.search?.trim()) {
        const searchRegex = new RegExp(req.query.search.trim(), "i");
        filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const sortBy = req.query.sortBy || req.query.sort?.replace(/^-/, "") || "createdAt";

    let tasks;
    let totalTasks;

    if (sortBy === "priority") {
        const matchedTasks = await Task.find(filter).lean();
        totalTasks = matchedTasks.length;
        tasks = sortTasksInMemory(matchedTasks, req.query).slice(skip, skip + limit);
    } else {
        totalTasks = await Task.countDocuments(filter);
        tasks = await Task.find(filter)
            .sort(buildSortOptions(req.query))
            .skip(skip)
            .limit(limit)
            .lean();
    }

    const totalPages = Math.ceil(totalTasks / limit) || 1;

    return res.status(200).json({
        tasks: tasks.map(formatTask),
        pagination: {
            page,
            limit,
            totalTasks,
            totalPages,
        },
        stats: {
            total: stats.total,
            pending: stats.pending,
            inProgress: stats.inProgress,
            completed: stats.completed,
        },
    });
});

const getTaskStats = asyncHandler(async (req, res) => {
    const userTasks = await Task.find({ createdBy: req.user._id }).lean();
    const stats = buildTaskStats(userTasks);

    return res.status(200).json({
        totalTasks: stats.totalTasks,
        pendingTasks: stats.pendingTasks,
        inProgressTasks: stats.inProgressTasks,
        completedTasks: stats.completedTasks,
    });
});

const getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(formatTask(task));
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    Object.assign(task, req.body);
    await task.save();

    return res.status(200).json(formatTask(task));
});

const markTaskComplete = asyncHandler(async (req, res) => {
    const task = await Task.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    task.status = TASK_STATUS.COMPLETED;
    await task.save();

    return res.status(200).json(formatTask(task));
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user._id,
    });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json({ success: true });
});

export {
    createTask,
    getAllTasks,
    getTaskStats,
    getTaskById,
    updateTask,
    markTaskComplete,
    deleteTask,
};
