import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";


const router = Router();

router.post("/create-task",createTask);
router.post("/get-tasks",getTasks);
router.put("/update-task/:id",updateTask);
router.delete("/delete-task/:id",deleteTask);


export default router;