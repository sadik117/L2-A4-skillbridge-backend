import express, { Application, NextFunction } from "express";
import cors from "cors";
import { Request, Response } from "express";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import routes from "./routes/routes";
import cookieParser from 'cookie-parser';


const app: Application = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);


app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


app.get("/", (req: Request, res: Response) => {
  res.send("Hello, You are in Skill Bridge!");
});

export default app;
