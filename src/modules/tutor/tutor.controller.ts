import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    tutorProfile?: { id: string };
    [key: string]: any;
  };
}

const upsertProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const profile = await tutorService.upsertTutorProfile(userId, req.body);

  res.status(200).json({
    success: true,
    message: "Tutor profile saved",
    data: profile,
  });
};

const setAvailability = async (req: AuthenticatedRequest, res: Response) => {
  const tutorProfileId = req.user?.tutorProfile?.id;
  if (!tutorProfileId) {
    return res.status(403).json({
      success: false,
      message: "Tutor profile not found",
    });
  }
  const { slots } = req.body;

  await tutorService.createAvailabilitySlots(tutorProfileId, slots);

  res.status(201).json({
    success: true,
    message: "Availability slots added",
  });
};

const tutorSessions = async (req: AuthenticatedRequest, res: Response) => {
  const tutorProfileId = req.user?.tutorProfile?.id;
  if (!tutorProfileId) {
    return res.status(403).json({
      success: false,
      message: "Tutor profile not found",
    });
  }
  const sessions = await tutorService.getTutorSessions(tutorProfileId);

  res.status(200).json({
    success: true,
    data: sessions,
  });
};

const getTutors = async (req: Request, res: Response) => {
  const tutors = await tutorService.getTutors(req.query);

  res.status(200).json({
    success: true,
    data: tutors,
  });
};

const tutorProfile = async (req: Request, res: Response) => {
  const tutor = await tutorService.getTutorDetails(req.params.id as string);

  res.status(200).json({
    success: true,
    data: tutor,
  });
};

export const tutorController = {
  upsertProfile,
  setAvailability,
  tutorSessions,
  getTutors,
  tutorProfile,
};
