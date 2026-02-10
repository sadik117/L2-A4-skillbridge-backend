import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { tutorService } from "../tutor/tutor.service";

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


 const tutorBookings = async (req: Request, res: Response) => {
  const tutorId = req.user!.id;

  const tutorProfile = await tutorService.getMyProfile(tutorId);

  if (!tutorProfile) {
    return res.status(403).json({ success: false, message: "Tutor profile not found" });
  }
  const bookings = await bookingService.getTutorBookings(tutorProfile.id);
  res.json({ success: true, data: bookings });
};

const completeSession = async (req: Request, res: Response) => {
  const bookingId = req.params.id;

  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required",
    });
  }

  const booking = await bookingService.completeSession(bookingId as string);

  res.status(200).json({
    success: true,
    data: booking,
  });
};

 const allBookings = async (req: Request, res: Response) => {
  const bookings = await bookingService.getAllBookings();
  res.json({ success: true, data: bookings });
};

export const bookingController = {
  bookSession,
  tutorBookings,
  allBookings,
  completeSession,
};
