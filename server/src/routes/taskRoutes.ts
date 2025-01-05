import { Router } from "express";
import { createTask, getTasks, updateTaskStatus } from "../Controllers/taskController";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:taskId/status", updateTaskStatus);  // route to update task

export default router;