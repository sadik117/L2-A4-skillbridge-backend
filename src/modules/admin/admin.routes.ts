import { Router } from "express";
import { adminController } from "./admin.controller";
import auth from "../../middleware/auth";

const adminRouter = Router();

adminRouter.get("/all-users", auth("user", "read"), adminController.getUsers);

adminRouter.patch("/user/status/:id", auth("user", "update"), adminController.changeUserStatus);

export default adminRouter;