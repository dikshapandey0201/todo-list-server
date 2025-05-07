"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
exports.getTasks = getTasks;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
const task_model_1 = __importDefault(require("../models/task.model"));
const mongoose_1 = __importDefault(require("mongoose"));
function createTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const task = new task_model_1.default(req.body);
            const savedTask = yield task.save();
            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: savedTask,
            });
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        }
    });
}
function getTasks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.body;
        try {
            const page = parseInt(req.query.page || "1");
            const limit = parseInt(req.query.limit || "10");
            const skip = (page - 1) * limit;
            const tasks = yield task_model_1.default.find({ user: userId })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            const total = yield task_model_1.default.find({ user: userId }).countDocuments();
            res.status(200).json({
                success: true,
                page,
                totalPages: Math.ceil(total / limit),
                totalTasks: total,
                tasks,
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    });
}
function updateTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const taskId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
                res.status(400).json({ success: false, message: "Invalid task ID" });
                return;
            }
            const updatedTask = yield task_model_1.default.findByIdAndUpdate(taskId, req.body, {
                new: true,
                runValidators: true,
            });
            if (!updatedTask) {
                res.status(404).json({ success: false, message: "Task not found" });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask,
            });
        }
        catch (error) {
            if (error instanceof mongoose_1.default.Error.ValidationError) {
                res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        }
    });
}
function deleteTask(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const taskId = req.params.id;
            if (!mongoose_1.default.Types.ObjectId.isValid(taskId)) {
                res.status(400).json({ success: false, message: "Invalid task ID" });
                return;
            }
            const deletedTask = yield task_model_1.default.findByIdAndDelete(taskId);
            if (!deletedTask) {
                res.status(404).json({ success: false, message: "Task not found" });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Task deleted successfully",
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    });
}
