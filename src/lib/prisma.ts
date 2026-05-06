import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.local.example to .env.local and fill in your Supabase connection string.'
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

type PrismaClientType = ReturnType<typeof createPrismaClient>;
const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };

function getPrismaClient(): PrismaClientType {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

// Lazy proxy — defers initialization (and env-var validation) until first query, not module load.
export const prisma = new Proxy({} as PrismaClientType, {
  get(_, prop: string | symbol) {
    return Reflect.get(getPrismaClient(), prop);
  },
});
