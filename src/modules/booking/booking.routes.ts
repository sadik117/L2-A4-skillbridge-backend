import { Router } from "express";
import { bookingController } from "./booking.controller";

const bookingRouter = Router();

bookingRouter.post("/book-session", bookingController.bookSession);
bookingRouter.get("/student-bookings", bookingController.studentBookings);
bookingRouter.get("/tutor-bookings", bookingController.tutorBookings);
bookingRouter.get("/all-bookings", bookingController.allBookings);

export default bookingRouter;