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
  const userId = req.user!.id;

  // alternative way to get tutor profile
  // const tutorProfile = await prisma.tutorProfile.findUnique({
  //   where: { userId },
  // });

  const tutorProfile = await tutorService.getMyProfile(userId);

  if (!tutorProfile) {
    return res.status(403).json({
      success: false,
      message: "Tutor profile not found",
    });
  }

  const { slots } = req.body;

  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Slots must be a non-empty array",
    });
  }

  await tutorService.createAvailabilitySlots(tutorProfile.id, slots);

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

const getTutor = async (req: Request, res: Response) => {
  const tutors = await tutorService.getTutor({
    search: req.query.search as string,
    categoryId: req.query.categoryId as string,
  });

  res.status(200).json({
    success: true,
    data: tutors,
  });
};


const tutorProfile = async (req: Request, res: Response) => {
  const { tutorId } = req.params;

  if (!tutorId)
    return res.status(400).json({
      success: false,
      message: "Tutor id is required",
    });

  try {
    const tutor = await tutorService.getTutorDetails(tutorId as string);
    if (!tutor) {
      return res
        .status(404)
        .json({ success: false, message: "Tutor not found" });
    }
    res.json({ success: true, data: tutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllTutors = async (req: Request, res: Response) => {
  const tutors = await tutorService.getAllTutors(); 
  res.status(200).json({
    success: true,
    data: tutors,
  });
};

const getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

  const tutor = await tutorService.getMyProfile(userId);

  res.json({ success: true, data: tutor });
};

export const tutorController = {
  upsertProfile,
  setAvailability,
  tutorSessions,
  getTutor,
  tutorProfile,
  getMyProfile,
  getAllTutors,
};
