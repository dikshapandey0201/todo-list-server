import express from 'express';
import {signup,signin,refreshToken,currentUser,updateUserProfile,logout, deleteUser} from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';


const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);
router.get('/current-user', authenticate, currentUser);
router.put('/update-profile', authenticate,updateUserProfile);
router.delete('/delete-user', authenticate, deleteUser);
router.post('/logout', logout);

export default router;
