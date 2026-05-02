import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key';

// 1. Extend the Express Request interface to include our custom user payload
    export interface AuthRequest extends Request {
      user?: {
        userId: string;
        username: string;
      };
      file?: Express.Multer.File;
    }

export const protectRoute = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // 2. Get the token from the Authorization header (Format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // 3. Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };

    // 4. Attach the decoded user payload to the request object
    req.user = decoded;

    // 5. Move to the next middleware or controller
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};