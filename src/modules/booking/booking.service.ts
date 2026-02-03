import { prisma } from "../../lib/prisma";

const createBooking = async (
  studentId: string,
  tutorId: string,
  slotId: string
) => {
  return prisma.$transaction(async (tx) => {
  
    const slot = await tx.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      throw new Error("Availability slot not found");
    }

    if (slot.isBooked) {
      throw new Error("Slot already booked");
    }

    await tx.availabilitySlot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return tx.booking.create({
      data: {
        studentId,
        tutorId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "CONFIRMED",
      },
    });
  });
};

 const getStudentBookings = async (studentId: string) => {
  return prisma.booking.findMany({
    where: { studentId },
    include: {
      tutor: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

 const getTutorBookings = async (tutorId: string) => {
  return prisma.booking.findMany({
    where: { tutorId },
    include: { student: true },
  });
};

 const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: true,
      tutor: { include: { user: true } },
    },
  });
};

export const bookingService = {
  createBooking,
  getStudentBookings,
  getTutorBookings,
  getAllBookings,
};
