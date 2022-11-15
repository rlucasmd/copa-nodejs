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
    return res.status(401).json({ message: 'Missing token' })
  }

  try {
    const decode = jwt.verify(token, SECRET);
    if (!decode)
      return res.status(401).send({ message: 'Token malformed' })

    //console.log(decode);
    const { sub, avatarUrl, name } = jwt.verify(token, SECRET) as user;
    req.userId = sub;
    req.user = { sub, avatarUrl, name };
  } catch (err) {
    console.log(err);
    return res.status(401).send({ message: 'token error' })
  }
  next();
}

export { verifyJwt };