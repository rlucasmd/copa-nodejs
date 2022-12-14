import express, { Request, Response } from 'express';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import cors from 'cors';
import { routes } from './routes';
import https from 'https';

const PORT = process.env.PORT ?? 3333;


const app = express();

app.use(cors({
  origin: true
}));

app.use(loggerMiddleware);
app.use(express.json());
app.use(routes);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ message: "Hello, World!" });
});



app.listen(+PORT, "0.0.0.0", () => {
  console.log(`Server is running, listening on PORT{${PORT}}`)
});
