import { prisma } from "../../lib/prisma";
import { AppError } from "../../error";

const createReview = async (
  studentId: string,
  bookingId: string,
  rating: number,
  comment: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.studentId !== studentId) {
    throw new AppError(403, "You can only review your own bookings");
  }

  if (booking.status !== "COMPLETED") {
    throw new AppError(400, "You can only review completed sessions");
  }

  if (booking.review) {
    throw new AppError(409, "You already reviewed this session");
  }

  return prisma.review.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      bookingId,
      rating,
      comment,
    },
  });
};

export const reviewService = {
  createReview,
};
