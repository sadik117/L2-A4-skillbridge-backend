import { prisma } from "../../lib/prisma";

 const upsertTutorProfile = async (
  userId: string,
  data: any
) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });
};

 const createAvailabilitySlots = async (
  tutorProfileId: string,
  slots: any[]
) => {
  return prisma.availabilitySlot.createMany({
    data: slots.map((slot) => ({
      tutorProfileId,
      startTime: slot.startTime,
      endTime: slot.endTime,
    })),
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

export const tutorService = {
  upsertTutorProfile,
  createAvailabilitySlots,
  getTutorSessions,
  getTutors,
  getTutorDetails,
};
