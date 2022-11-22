import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../middleware/verifyJwt';
import z, { string } from 'zod';

const routes = Router();

routes.get('/pools/:id/games', verifyJwt, async (req: Request, res: Response) => {
  const getPoolParams = z.object({
    id: z.string()
  });
  const { id } = getPoolParams.parse(req.params);
  const prismaGames = await prisma.game.findMany({
    orderBy: {
      date: 'desc'
    },
    include: {
      guesses: {
        where: {
          participant: {
            userId: req.user.sub,
            poolId: id

          }
        }
      }
    }
  });

  console.log(prismaGames);

  const games = prismaGames.map((game) => {
    return {
      ...game,
      guess: game.guesses.length > 0 ? game.guesses[0] : null,
      guesses: undefined
    }
  });

  res.status(200).json({ games });
});


export default routes;