import { Router } from "express";
import { categoryController } from "./category.controller";

const categoryRouter = Router();

categoryRouter.post("/", categoryController.addCategory);
categoryRouter.get("/", categoryController.getCategories);

export default categoryRouter;