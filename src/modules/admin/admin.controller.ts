import { prisma } from "../../lib/prisma";

 const getUsers = async () => {
  return prisma.user.findMany();
};

 const updateStatus = async (id: string, status: any) => {
  return prisma.user.update({
    where: { id },
    data: { status },
  });
};

export const adminController = {
    getUsers,
    updateStatus
}
