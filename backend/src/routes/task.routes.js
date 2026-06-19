import { Router } from "express";
import {
    createTask,
    getAllTasks,
    getTaskStats,
    getTaskById,
    updateTask,
    markTaskComplete,
    deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createTaskValidator,
    updateTaskValidator,
    taskIdValidator,
} from "../middlewares/validators/task.validator.js";

const router = Router();

router.use(verifyJWT);

router.route("/stats").get(getTaskStats);
router.route("/").get(getAllTasks).post(createTaskValidator, validate, createTask);
router
    .route("/:id")
    .get(taskIdValidator, validate, getTaskById)
    .put(updateTaskValidator, validate, updateTask)
    .delete(taskIdValidator, validate, deleteTask);
router.route("/:id/complete").patch(taskIdValidator, validate, markTaskComplete);

export default router;
