import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middleware/auth";


const tutorRouter = Router();

tutorRouter.get("/",  tutorController.getTutor);

tutorRouter.get("/browse-tutors", tutorController.getAllTutors);

tutorRouter.put("/profile", tutorController.upsertProfile);

tutorRouter.post("/set-availability", auth("tutorProfile", "create"), tutorController.setAvailability);

tutorRouter.get("/sessions", auth("booking", "read"), tutorController.tutorSessions);

tutorRouter.get("/profile/:tutorId", auth("tutorProfile", "read"), tutorController.tutorProfile);

tutorRouter.get("/my-profile", auth("tutorProfile", "read"), tutorController.getMyProfile);

export default tutorRouter;