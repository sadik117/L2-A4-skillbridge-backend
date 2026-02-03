import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth";

const reviewRouter = Router();

reviewRouter.post("/", auth("review", "create"), reviewController.createReview);

export default reviewRouter;