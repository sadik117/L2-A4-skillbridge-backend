import { prisma } from "../../lib/prisma";


 const createReview = async (
  studentId: string,
  bookingId: string,
  rating: number,
  comment: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

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
