import { Request, Response } from "express";
import { categoryService } from "./category.service";

 const addCategory = async (req: Request, res: Response) => {
  const { name, slug } = req.body;
  const category = await categoryService.createCategory(name, slug);
  res.status(201).json({ success: true, data: category });
};

 const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  res.json({ success: true, data: categories });
};

export const categoryController = {
  addCategory,
  getCategories,
};
