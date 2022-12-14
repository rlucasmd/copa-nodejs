import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@email.com",
      avatarUrl: "https://github.com/ranieri3232.png"
    }
  });

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'Bool123',
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id
        }
      }
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-11T12:00:00.099Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR'
    }
  });

  await prisma.game.create({
    data: {
      date: '2022-11-12T12:00:00.099Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode: 'AR',

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }


    }
  });
}

// main();

async function createMultiplesUsers() {
  for (let i = 0; i < 350; i++) {
    const num = Math.floor(Math.random() * 100000).toString().padStart(6, '0');
    // console.log(num);
    const user = await prisma.user.create({
      data: {
        email: `dude${num}@email.com`,
        name: `dude${num}`
      }
    });
  }
}

createMultiplesUsers();