import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const routes = Router();

routes.get('/users/count', async (req: Request, res: Response) => {
    const count = await prisma.user.count();

    return res.status(200).json({ count });
});

export default routes;