import { PrismaClient } from '@prisma/client';
import { User } from './types';

const prisma = new PrismaClient();

async function getUserInfoPrisma(user: User) {
  let userdb = await prisma.user.findFirst({
    where: {
      name: user.name,
    },
  });
  if (!userdb) {
    await prisma.user.create({
      data: {
        name: user.name,
        balance: 0,
      },
    });
    userdb = await prisma.user.findFirst({
      where: {
        name: user.name,
      },
    });
  }
  return userdb;
}

export async function getUserBalance(user: User) {
  const userPrisma = await getUserInfoPrisma(user);
  return userPrisma.balance;
}

export async function getUserServersTotal(user: User) {
  const userPrisma = await getUserInfoPrisma(user);
  const serversCount = await prisma.server.count({
    where: {
      User: userPrisma,
    },
  });
  return serversCount;
}

export async function getUserServersOnline(user: User) {
  // unimplemented normally from MVP
  const serversOnlineCount = await getUserServersTotal(user);
  return serversOnlineCount;
}

export async function getUserServersNameList(user: User): Promise<string[]> {
  const userPrisma = await getUserInfoPrisma(user);
  const servers = await prisma.server.findMany({
    where: {
      User: userPrisma,
    },
  });
  const serverList = servers.map((server) => server.name);
  return serverList;
}
