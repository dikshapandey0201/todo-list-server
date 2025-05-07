import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { generateAccessToken } from "../utils/jwt";


interface IRequestUser extends Request {
  userId?: string;
}

const ACCESS_SECRET = process.env.JWT_SECRET || "secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export const authenticate = async (
  req: IRequestUser,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;
  try {

  if (!accessToken && !refreshToken) {
    res.status(401).json({
      success: false,
      message: "No tokens provided",
    });
    return;
  }

    const decoded = jwt.verify(accessToken, ACCESS_SECRET) as { id: string };
    req.userId = decoded.id;
    return next();
  } catch (err:any) {
  
    if (err.name !== "TokenExpiredError") {
      res.status(403).json({
        success: false,
        message: "Invalid access token",
      });
      return;
    }
  }

  try {

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: string };
    req.userId = decoded.id;

    const newAccessToken = generateAccessToken(decoded.id.toString());
    req.userId = decoded.id;

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });

    return next();
  } catch (err) {
    res.status(403).json({
      success: false,
      message: "Invalid tokens",
    });
    return;
  }
};
