import { get } from "node:http";
import { prisma } from "../../lib/prisma";

const upsertTutorProfile = async (
  userId: string,
  data: {
    bio: string;
    hourlyRate: number;
    experience: number;
    categoryId: string;
  }
) => {
  const { bio, hourlyRate, experience, categoryId } = data;

  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio,
      hourlyRate,
      experience,
      category: {
        connect: { id: categoryId },
      },
    },
    create: {
      bio,
      hourlyRate,
      experience,
      user: { connect: { id: userId } },
      category: { connect: { id: categoryId } },
    },
  });
};

const createAvailabilitySlots = async (
  tutorProfileId: string,
  slots: {
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
  }[]
) => {
  if (!slots || slots.length === 0) {
    throw new Error("No availability slots provided");
  }

  return prisma.availabilitySlot.createMany({
    data: slots.map((slot) => ({
      tutorProfileId,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      daysOfWeek: slot.daysOfWeek,
    })),
    skipDuplicates: true,
  });
};

const getTutorBookings = async (tutorProfileId: string) => {
  return prisma.booking.findMany({
    where: { tutorId: tutorProfileId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const getTutor = async (filters: { search?: string; categoryId?: string }) => {
  const { search, categoryId } = filters;

  return prisma.tutorProfile.findMany({
    where: {
      AND: [
        categoryId ? { categoryId } : {},
        search
          ? {
              OR: [
                { bio: { contains: search, mode: "insensitive" } },
                { category: { name: { contains: search, mode: "insensitive" } } },
                { user: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {},
      ],
    },
    include: {
      user: true,
      category: true,
      reviews: true,
    },
  });
};

const getAllTutors = async () => {
  return prisma.tutorProfile.findMany({
    include: { user: true, category: true, reviews: true },
  });
};

const getTutorDetails = async (id: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
      reviews: {
        include: {
          student: { select: { id: true, name: true } },
        },
      },
      availability: true,
    },
  });
};

const getMyProfile = async (userId: string) => {
  return prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      availability: true,
      reviews: {
        include: {
          student: { select: { id: true, name: true } },
        },
      },
      category: true,
    },
  });
};

const getFeaturedTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    take: 6,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      category: true,
      reviews: true,
    },
    orderBy: {
      createdAt: "desc", 
    },
  });

  return tutors.map((tutor) => {
    const avgRating =
      tutor.reviews.length > 0
        ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) /
          tutor.reviews.length
        : 0;

    return {
      ...tutor,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews: tutor.reviews.length,
    };
  });
};


export const tutorService = {
  upsertTutorProfile,
  createAvailabilitySlots,
  getTutorBookings,
  getTutor,
  getTutorDetails,
  getMyProfile,
  getAllTutors,
  getFeaturedTutors,
};
