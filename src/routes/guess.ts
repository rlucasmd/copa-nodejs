import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyJwt } from '../middleware/verifyJwt';
import z from 'zod';

const routes = Router();


routes.get('/guesses/count', async (req: Request, res: Response) => {
  const count = await prisma.guess.count();

  return res.status(200).json({ count });
});

routes.post('/pools/:poolId/games/:gameId/guesses', verifyJwt, async (req: Request, res: Response) => {
  const createGuessParams = z.object({
    poolId: z.string(),
    gameId: z.string()
  });
  const createGuessBody = z.object({
    firstTeamPoints: z.number(),
    secondTeamPoints: z.number()
  });
  const { poolId, gameId } = createGuessParams.parse(req.params);
  const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(req.body);

  const participant = await prisma.participant.findUnique({
    where: {
      userId_poolId: {
        poolId,
        userId: req.user.sub,
      }
    }
  });

  if (!participant)
    return res.status(400).json({ message: "You're not allowed to create a guess to this pool." })

  const guess = await prisma.guess.findUnique({
    where: {
      participantId_gameId: {
        participantId: participant.id,
        gameId
      }
    }
  });
  if (!guess) {
    return res.status(400).json({ message: "You already sent guess to this game on this pool." })
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId
    }
  });
  if (!game)
    return res.status(400).json({ message: 'Game not found' });

  if (game.date < new Date())
    return res.status(400).json({ message: "You cannot send guesses after the game date." });

  await prisma.guess.create({
    data: {
      gameId,
      participantId: participant.id,
      firstTeamPoints,
      secondTeamPoints
    }
  });

  return res.status(201);

});

export default routes;