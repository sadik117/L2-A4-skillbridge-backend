import express from 'express';
import cors from 'cors';
import { Request, Response } from "express";

const app = express();

 app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });

export default app;