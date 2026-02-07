import { prisma } from "../../lib/prisma";


 const updateUserRole = async (userId: string, role: "TUTOR" | "STUDENT") => {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
  });
};

export const userService = {
  updateUserRole,
};  