import { Request, Response } from "express";
import { reviewService } from "./review.service";


 const createReview = async (req: Request, res: Response) => {
  const { bookingId, rating, comment } = req.body;

  const review = await reviewService.createReview(
    req.user!.id,
    bookingId,
    rating,
    comment
  );

  res.status(201).json({ success: true, data: review });
};

export const reviewController = {
  createReview,
};
