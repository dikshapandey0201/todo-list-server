"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post('/signup', auth_controller_1.signup);
router.post('/signin', auth_controller_1.signin);
router.post('/refresh-token', auth_controller_1.refreshToken);
router.get('/current-user', auth_middleware_1.authenticate, auth_controller_1.currentUser);
router.put('/update-profile', auth_middleware_1.authenticate, auth_controller_1.updateUserProfile);
router.delete('/delete-user', auth_middleware_1.authenticate, auth_controller_1.deleteUser);
router.post('/logout', auth_controller_1.logout);
exports.default = router;
