import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // Enable logging for debugging (optional)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
