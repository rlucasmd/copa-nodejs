import express, { Request, Response } from 'express';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import cors from 'cors';

const prisma = new PrismaClient({
  log: ['query']
});

const PORT = process.env.PORT ?? 3333;


const app = express();

app.use(cors({
  origin: true
}));

app.use(loggerMiddleware);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  // return res.sendStatus(200);
  return res.status(200).json({ message: "Hello, World!" });
});

app.get('/pools/count', async (req: Request, res: Response) => {
  const count = await prisma.pool.count();

  return res.status(200).json({ count });
});

app.post('/pools', async (req: Request, res: Response) => {
  const createPoolBody = z.object({
    title: z.string(),
  });

  const { title } = createPoolBody.parse(req.body);
  const generate = new ShortUniqueId({ length: 6 });
  const code = String(generate()).toUpperCase();
  const pool = await prisma.pool.create({
    data: {
      title,
      code,
    }
  });

  return res.status(201).json({ code });
});

app.get('/users/count', async (req: Request, res: Response) => {
  const count = await prisma.user.count();

  return res.status(200).json({ count });
});

app.get('/guesses/count', async (req: Request, res: Response) => {
  const count = await prisma.guess.count();

  return res.status(200).json({ count });
});

app.listen(PORT, /*"0.0.0.0",*/() => {
  console.log(`Server is running, listening on PORT{${PORT}}`)
});