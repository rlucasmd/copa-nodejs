import express, { Request, Response } from 'express';
import { loggerMiddleware } from './middleware/loggerMiddleware';

const PORT = process.env.PORT ?? 3333;


const app = express();

app.use(loggerMiddleware);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  // return res.sendStatus(200);
  return res.json({ message: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running, listening on PORT{${PORT}}`)
});