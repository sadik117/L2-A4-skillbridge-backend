import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const bookingRouter = Router();

bookingRouter.post("/book-session", auth("booking", "create"), bookingController.bookSession);
bookingRouter.get("/student-bookings", auth("booking", "read"), bookingController.studentBookings);
bookingRouter.get("/tutor-bookings", auth("booking", "read"), bookingController.tutorBookings);
bookingRouter.get("/all-bookings", auth("booking", "read"), bookingController.allBookings);

export default bookingRouter;