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
exports.signup = signup;
exports.signin = signin;
exports.refreshToken = refreshToken;
exports.currentUser = currentUser;
exports.updateUserProfile = updateUserProfile;
exports.deleteUser = deleteUser;
exports.logout = logout;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const task_model_1 = __importDefault(require("../models/task.model"));
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const userExists = yield user_model_1.default.findOne({ email });
            if (userExists) {
                res.status(400).json({ success: false, message: "User already exists" });
                return;
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = new user_model_1.default({ name, email, password: hashedPassword });
            yield user.save();
            res
                .status(201)
                .json({ success: true, message: "User created successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: `Internal server error: ${error.message}`,
                });
            }
            else {
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        }
    });
}
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                res.status(409).json({ success: false, message: "User Not Found" });
                return;
            }
            const validUser = yield bcryptjs_1.default.compare(password, user.password);
            if (!validUser) {
                res.status(409).json({ success: false, message: "Invalid Password" });
                return;
            }
            const accessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
            const refreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
            user.refreshToken = refreshToken;
            yield user.save();
            res
                .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
                .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
                .json({ success: true, message: "Login successful" });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token) {
            res.sendStatus(401).json({ message: "No refresh token provided" });
            return;
        }
        try {
            const payload = (0, jwt_1.verifyRefreshToken)(token);
            const user = yield user_model_1.default.findById(payload.id);
            if (!user || user.refreshToken !== token) {
                res.sendStatus(403).json({ message: "Invalid refresh token" });
                return;
            }
            const newAccessToken = (0, jwt_1.generateAccessToken)(user._id.toString());
            const newRefreshToken = (0, jwt_1.generateRefreshToken)(user._id.toString());
            user.refreshToken = newRefreshToken;
            yield user.save();
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
                .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
                .json({ success: true, message: "Token Refreshed" });
        }
        catch (err) {
            res.sendStatus(403);
        }
    });
}
function currentUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.default.findById(req.userId).select("-password -refreshToken");
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
function updateUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email } = req.body;
            const user = yield user_model_1.default.findById(req.userId).select("-password -refreshToken");
            if (!user) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }
            user.name = name !== null && name !== void 0 ? name : user.name;
            user.email = email !== null && email !== void 0 ? email : user.email;
            const updatedUser = yield user.save();
            res.json({
                success: true,
                message: "Profile updated successfully",
                user: updatedUser,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.userId) {
                res
                    .status(401)
                    .json({ success: false, message: "User not authenticated" });
                return;
            }
            yield task_model_1.default.deleteMany({ user: req.userId });
            const deletedUser = yield user_model_1.default.findByIdAndDelete(req.userId);
            if (!deletedUser) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
                .clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "none",
            })
                .status(200)
                .json({ success: true, message: "User deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!token) {
            res.sendStatus(204);
            return;
        }
        const user = yield user_model_1.default.findOne({ refreshToken: token });
        if (user) {
            user.refreshToken = "";
            yield user.save();
        }
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })
            .clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        })
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    });
}
