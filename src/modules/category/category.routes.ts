import { Router } from "express";
import { categoryController } from "./category.controller";
import auth from "../../middleware/auth";

const categoryRouter = Router();

categoryRouter.post("/", auth("subjectCategory", "create"), categoryController.addCategory);

categoryRouter.get("/", categoryController.getCategories);

export default categoryRouter;