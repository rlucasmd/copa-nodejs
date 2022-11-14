import { Router, Request, Response, NextFunction } from 'express';
import ShortUniqueId from 'short-unique-id';
import { prisma } from '../lib/prisma';
import z, { string } from 'zod';
import { verify as jwtverify, } from 'jsonwebtoken';
import 'dotenv/config';
import { verifyJwt } from '../middleware/verifivyJwt';

const SECRET = process.env.ENCRYPT_HASH!;

interface user {
  name: string;
  avatarUrl: string;
  sub: string;
}

const routes = Router();

async function verify(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new Error('Error: missing jwt!');
  }

  try {
    const decode = jwtverify(token, SECRET);
    if (!decode)
      throw new Error('Error: malformed jwt');

    const { sub, avatarUrl, name } = jwtverify(token, SECRET) as user;
    req.userId = sub;
    req.user = { sub, avatarUrl, name };
  } catch (err) {
    throw new Error('Error');
  }
}

routes.get('/pools/count', async (req: Request, res: Response) => {
  const count = await prisma.pool.count();

  return res.status(200).json({ count });
});
routes.post('/pools', async (req: Request, res: Response, next: NextFunction) => {
  const createPoolBody = z.object({
    title: z.string(),
  });

  const { title } = createPoolBody.parse(req.body);
  const generate = new ShortUniqueId({ length: 6 });
  const code = String(generate()).toUpperCase();


  try {
    await verify(req, res);
    console.log('->', req.user);
    await prisma.pool.create({
      data: {
        title,
        code,
        ownerId: req.user.sub,
        participants: {
          create: {
            userId: req.user.sub
          }
        }
      }
    });
  } catch (err) {
    await prisma.pool.create({
      data: {
        title,
        code,
      }
    });
  }
  return res.status(201).json({ code });
});

routes.post('/pools/:id/join', verifyJwt, async (req: Request, res: Response) => {
  const joinPoolBody = z.object({
    code: z.string()
  });

  const { code } = joinPoolBody.parse(req.body);
  const pool = await prisma.pool.findUnique({
    where: { code },
    include: {
      participants: {
        where: {
          userId: req.user.sub
        }
      }
    }
  });
  if (!pool)
    return res.status(400).json({ message: 'Pool not found' });

  if (pool.participants.length > 0) {
    return res.status(400).json({
      message: 'You already joined this pool'
    });
  }

  if (!pool.ownerId) {
    await prisma.pool.update({
      where: {
        id: pool.id

      },
      data: {
        ownerId: req.user.sub,
      }
    });
  }

  await prisma.participant.create({
    data: {
      poolId: pool.id,
      userId: req.user.sub
    }
  });

  return res.sendStatus(201);

});

export default routes;