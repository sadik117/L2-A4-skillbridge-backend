import { Router } from "express";
import { studentController } from "./student.controller";
import auth from "../../middleware/auth";

const studentRouter = Router();

studentRouter.get("/my-profile", auth("user", "read"), studentController.myStudentProfile);

studentRouter.get("/my-bookings", auth("user", "read"), studentController.studentBookings);

export default studentRouter;