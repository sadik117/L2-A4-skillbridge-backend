import { Router } from "express";
import { ragController } from "./rag.controller";

const router = Router();

router.post("/ingest-tutors", ragController.ingestTutors);

router.post("/query", ragController.queryRag);

export const ragRouter = router;
