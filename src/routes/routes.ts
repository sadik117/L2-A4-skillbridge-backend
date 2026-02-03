import { Router } from "express";
import tutorRouter from "../modules/tutor/tutor.routes";
import adminRouter from "../modules/admin/admin.routes";
import bookingRouter from "../modules/booking/booking.routes";
import categoryRouter from "../modules/category/category.routes";

const routes = Router();

routes.use("/tutor", tutorRouter);
routes.use("/booking", bookingRouter);
routes.use("/admin", adminRouter);
routes.use("/category", categoryRouter)

export default routes;