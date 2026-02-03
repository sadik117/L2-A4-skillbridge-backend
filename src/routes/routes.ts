import { Router } from "express";
import tutorRouter from "../modules/tutor/tutor.routes";
import adminRouter from "../modules/admin/admin.routes";

const routes = Router();

routes.use("/tutor", tutorRouter);
routes.use("/admin", adminRouter)

export default routes;