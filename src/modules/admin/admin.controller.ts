import { Request, Response } from "express";
import { adminService } from "./admin.service";


 const listUsers = async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({ success: true, data: users });
};

 const changeUserStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const updatedUser = await adminService.updateUserStatus(id as string, status);
  res.status(200).json({
    success: true,
    message: `User status updated to ${status}`,
    data: updatedUser,
  });
};

export const adminController = {
  listUsers,
  changeUserStatus,
};
