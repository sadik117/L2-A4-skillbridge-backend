import { prisma } from "../../lib/prisma";

 const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

 const updateUserStatus = async (id: string, status: "ACTIVE" | "BANNED") => {
  return prisma.user.update({
    where: { id },
    data: { status },
  });
};

const getDashboardStats = async () => {
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const totalTutors = await prisma.tutorProfile.count();
    const totalBookings = await prisma.booking.count();
    const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } });
    const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } });
    const totalReviews = await prisma.review.count();

     return {
      totalUsers,
      totalStudents,
      totalTutors,
      totalBookings,
      completedBookings,
      confirmedBookings,
      totalReviews,
    };
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getDashboardStats,
};