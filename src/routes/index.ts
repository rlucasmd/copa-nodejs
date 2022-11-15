import { Router } from 'express';
import poolRoutes from './pool';
import guessRoutes from './guess';
import gameRoutes from './game';
import authRoutes from './auth';
import userRoutes from './user';


const routes = Router();

routes.use(poolRoutes);
routes.use(guessRoutes);
routes.use(gameRoutes);
routes.use(authRoutes);
routes.use(userRoutes);

export { routes };