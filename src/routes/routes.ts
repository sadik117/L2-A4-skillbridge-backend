import { Router } from "express";
import tutorRouter from "../modules/tutor/tutor.routes";
import adminRouter from "../modules/admin/admin.routes";
import bookingRouter from "../modules/booking/booking.routes";

const routes = Router();

routes.use("/tutor", tutorRouter);
routes.use("/admin", adminRouter);
routes.use("/booking", bookingRouter);

export default routes;