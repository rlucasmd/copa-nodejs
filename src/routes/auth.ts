import z, { string } from 'zod';
import { Router, Request, Response, application } from 'express';
import { prisma } from '../lib/prisma';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { verifyJwt } from '../middleware/verifyJwt';

const routes = Router();

const SECRET = process.env.ENCRYPT_HASH!;

routes.post('/users', async (req: Request, res: Response) => {
  const createUserBody = z.object({
    access_token: z.string(),

  });
  const { access_token } = createUserBody.parse(req.body);

  const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  const userData = await userResponse.json();
  const userInfoSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    picture: z.string().url()
  });

  const userInfo = userInfoSchema.parse(userData);
  let user = await prisma.user.findUnique({
    where: {
      googleId: userInfo.id
    }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        googleId: userInfo.id,
        email: userInfo.email,
        avatarUrl: userInfo.picture,
        name: userInfo.name
      }
    });
  }
  const token = await jwt.sign({
    name: user.name,
    avatarUrl: user.avatarUrl
  }, SECRET, {
    subject: user.id,
    expiresIn: '1 day'
  });

  return res.send(
    { token }
  )
});
routes.get('/me', verifyJwt, async (req: Request, res: Response) => {
  console.log(req.user);
  res.sendStatus(200);
});


export default routes;