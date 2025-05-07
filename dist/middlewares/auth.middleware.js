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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../utils/jwt");
const ACCESS_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
    const refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
    try {
        if (!accessToken && !refreshToken) {
            res.status(401).json({
                success: false,
                message: "No tokens provided",
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(accessToken, ACCESS_SECRET);
        req.userId = decoded.id;
        return next();
    }
    catch (err) {
        if (err.name !== "TokenExpiredError") {
            res.status(403).json({
                success: false,
                message: "Invalid access token",
            });
            return;
        }
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        req.userId = decoded.id;
        const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.id.toString());
        req.userId = decoded.id;
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
        });
        return next();
    }
    catch (err) {
        res.status(403).json({
            success: false,
            message: "Invalid tokens",
        });
        return;
    }
});
exports.authenticate = authenticate;
