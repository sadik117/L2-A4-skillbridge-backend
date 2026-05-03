import app from "./app";
import { prisma } from "./lib/prisma";
import "dotenv/config";
import { redisService } from "./lib/redis";

const port = process.env.PORT;


async function server() {
  try {
    await prisma.$connect();
    await redisService.connect().catch((err) => {
      console.error("Redis connection error:", err);
      // Don't exit, app should still run
    });

    // app.listen(port, () => {
    //   console.log(`Server is running at ${port}`);
    // });

  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();
