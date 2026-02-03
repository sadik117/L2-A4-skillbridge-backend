import { Request, Response } from "express";
import { bookingService } from "./booking.service";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; tutorProfile?: { id: string } };
    }
  }
}

 
 const bookSession = async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const { tutorId, slotId } = req.body;

  const booking = await bookingService.createBooking(
    studentId,
    tutorId,
    slotId
  );

  res.status(201).json({ success: true, data: booking });
};


 const studentBookings = async (req: Request, res: Response) => {
  const bookings = await bookingService.getStudentBookings(req.user!.id);
  res.json({ success: true, data: bookings });
};


 const tutorBookings = async (req: Request, res: Response) => {
  const tutorId = req.user?.tutorProfile?.id;
  if (!tutorId) {
    return res.status(403).json({ success: false, message: "Tutor profile not found" });
  }
  const bookings = await bookingService.getTutorBookings(tutorId);
  res.json({ success: true, data: bookings });
};


 const allBookings = async (req: Request, res: Response) => {
  const bookings = await bookingService.getAllBookings();
  res.json({ success: true, data: bookings });
};

export const bookingController = {
  bookSession,
  studentBookings,
  tutorBookings,
  allBookings,
};
