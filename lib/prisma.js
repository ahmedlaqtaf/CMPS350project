import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;
const databaseUrl = `file:${path.join(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/")}`;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
