import express, { Application } from 'express';
import cors from 'cors';
import { Request, Response } from "express";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import routes from './routes/routes';

const app: Application = express();

app.use(express.json());

app.use(cors(
  { origin: '*' }

));

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/v1/routes", routes);

 app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

export default app;