import { Router } from "express";
import { tutorController } from "./tutor.controller";


const tutorRouter = Router();

tutorRouter.put("/profile", tutorController.upsertProfile);
tutorRouter.post("/availability", tutorController.setAvailability);
tutorRouter.get("/sessions", tutorController.tutorSessions);

export default tutorRouter;