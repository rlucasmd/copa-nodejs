import { Request, Response, NextFunction } from "express";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const time = new Date();
  const time_formated = `${time.getDay()}/${time.getMonth()}/${time.getFullYear()} - ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
  console.log(`method: ${req.method} path: ${req.path} time: ${time_formated} status:${res.statusCode}`);
  next();
}

export { loggerMiddleware };