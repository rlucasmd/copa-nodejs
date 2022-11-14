import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const SECRET = process.env.ENCRYPT_HASH!;

interface user {
  name: string;
  avatarUrl: string;
  sub: string;
}
async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Error: missing jwt!');
  }

  try {
    const decode = jwt.verify(token, SECRET);
    if (!decode)
      throw new Error('Error: malformed jwt');

    //console.log(decode);
    const { sub, avatarUrl, name } = jwt.verify(token, SECRET) as user;
    req.userId = sub;
    req.user = { sub, avatarUrl, name };
  } catch (err) {
    throw new Error('Error');
  }
  next();
}

export { verifyJwt };