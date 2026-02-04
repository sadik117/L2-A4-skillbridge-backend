import { prisma } from "../../lib/prisma";

const upsertTutorProfile = async (
  userId: string,
  data: {
    bio: string;
    hourlyRate: number;
    experience: number;
    categoryId: string;
  },
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

      user: {
        connect: { id: userId },
      },

      category: {
        connect: { id: categoryId },
      },
    },
  });
};

const createAvailabilitySlots = async (
  tutorProfileId: string,
  slots: {
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
  }[],
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

const getTutorSessions = async (tutorProfileId: string) => {
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

const getTutors = async (filters: any) => {
  return prisma.tutorProfile.findMany({
    where: {
      categoryId: filters.categoryId || undefined,
    },
    include: {
      user: true,
      reviews: true,
      category: true,
    },
  });
};

const getTutorDetails = async (id: string) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
            },
          },
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

export const tutorService = {
  upsertTutorProfile,
  createAvailabilitySlots,
  getTutorSessions,
  getTutors,
  getTutorDetails,
  getMyProfile,
};
