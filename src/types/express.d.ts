import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;  
      };
    }
  }
}

// If you still need IRequestUser elsewhere, make it consistent
export interface IRequestUser extends Request {
  user?: {
    _id: string;
  };
  body: any;
  query: any;
  cookies: any;
}