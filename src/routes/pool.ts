import { Router, Request, Response } from 'express';
import ShortUniqueId from 'short-unique-id';
import { prisma } from '../lib/prisma';
import z from 'zod';

const routes = Router();

routes.get('/pools/count', async (req: Request, res: Response) => {
    const count = await prisma.pool.count();

    return res.status(200).json({ count });
});
routes.post('/pools', async (req: Request, res: Response) => {
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

export default routes;