import express, { Request, Response } from 'express';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import { PrismaClient } from '@prisma/client';
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
  return res.json({ message: "Hello, World!" });
});

app.get('/pools/count', async (req: Request, res: Response) => {
  const count = await prisma.pool.count();

  return res.status(200).json({ count });
});

app.listen(PORT, /*"0.0.0.0",*/() => {
  console.log(`Server is running, listening on PORT{${PORT}}`)
});