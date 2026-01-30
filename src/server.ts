import app from "./app";
import { auth } from "./lib/auth";
import { prisma } from "./lib/prisma";
import { toNodeHandler } from "better-auth/node";

const port = process.env.PORT;

app.all("/api/auth/*", toNodeHandler(auth));

async function server() {
  try {
    await prisma.$connect();

    app.listen(port, () => {
      console.log(`Server is running at ${port}`);
    });

  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();
