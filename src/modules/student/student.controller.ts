import { Request, Response } from "express";
import { studentService } from "./student.service";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}


const myStudentProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

  const student = await studentService.getStudentProfile(userId);

  res.json({ success: true, data: student });
};


const studentBookings = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

  const bookings = await studentService.getStudentBookings(userId);

  res.json({ success: true, data: bookings });
};

export const studentController = {
  myStudentProfile,
  studentBookings,
};
