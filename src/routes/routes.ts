import { Router } from "express";
import tutorRouter from "../modules/tutor/tutor.routes";
import adminRouter from "../modules/admin/admin.routes";
import bookingRouter from "../modules/booking/booking.routes";
import categoryRouter from "../modules/category/category.routes";
import reviewRouter from "../modules/review/review.routes";
import studentRouter from "../modules/student/student.routes";
import userRouter from "../modules/user/user.routes";

const routes = Router();

routes.use("/tutor", tutorRouter);
routes.use("/booking", bookingRouter);
routes.use("/admin", adminRouter);
routes.use("/category", categoryRouter)
routes.use("/review", reviewRouter);
routes.use("/student", studentRouter);
routes.use("/user", userRouter);

export default routes;