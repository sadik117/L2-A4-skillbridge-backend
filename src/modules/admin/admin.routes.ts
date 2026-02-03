import { Router } from "express";
import { adminController } from "./admin.controller";

const adminRouter = Router();

adminRouter.get("/all-users", adminController.getUsers);
adminRouter.patch("/user/:id/status", adminController.changeUserStatus);

export default adminRouter;