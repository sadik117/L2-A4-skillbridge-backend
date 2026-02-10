import { prisma } from "../../lib/prisma";


const getStudentProfile = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: {
          tutor: { include: { user: true, category: true } },
        },
        orderBy: { startTime: "desc" },
      },
      reviews: true,
    },
  });
};


const getStudentBookings = async (studentId: string) => {
  return prisma.booking.findMany({
    where: { studentId },
    include: {
      tutor: { include: { user: true, category: true, } },
    },
    orderBy: { startTime: "desc" },
  });
};

export const studentService = {
  getStudentProfile,
  getStudentBookings,
};
