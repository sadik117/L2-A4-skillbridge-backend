import { prisma } from "../../lib/prisma";


 const createCategory = async (name: string, slug: string) => {
  return prisma.subjectCategory.create({
    data: { name, slug },
  });
};

 const getCategories = async () => {
  return prisma.subjectCategory.findMany({
    where: { isActive: true },
  });
};

export const categoryService = {
  createCategory,
  getCategories,
};
