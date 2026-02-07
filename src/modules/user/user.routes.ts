import { Router } from "express";
import { updateRoleController } from "./user.controller";
import auth from "../../middleware/auth";


const userRouter = Router();

userRouter.patch("/role", auth("user", "update"), updateRoleController);

export default userRouter; 
