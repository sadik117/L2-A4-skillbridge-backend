import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";


const tutorRouter = Router();

tutorRouter.put("/profile", auth("tutorProfile", "update"), tutorController.upsertProfile);

tutorRouter.post("/set-availability", auth("tutorProfile", "create"), tutorController.setAvailability);

tutorRouter.get("/sessions", auth("booking", "read"), tutorController.tutorSessions);

tutorRouter.get("/all-tutors", auth("tutorProfile", "read"), tutorController.getTutors);

tutorRouter.get("/profile/:tutorId", auth("tutorProfile", "read"), tutorController.tutorProfile);

tutorRouter.get("/my-profile", auth("tutorProfile", "read"), tutorController.getMyProfile);

export default tutorRouter;