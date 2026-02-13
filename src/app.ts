import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import routes from "./routes/routes";

const app: Application = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

// Configure CORS to allow both production and Vercel preview deployments
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.PROD_FRONTEND_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/skill-bridge-connect.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); // Any Vercel deployment

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],
  }),
);


/* Better Auth Route */
app.all("/api/auth/*splat", toNodeHandler(auth));

/*  API Routes */
app.use("/api/v1", routes);

/* Root Route */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, You are in Skill Bridge!");
});

/* Global Error Handler */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("ERROR:", err);

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
