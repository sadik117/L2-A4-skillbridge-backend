import { Request, Response } from "express";
import { adminService } from "./admin.service";


 const getUsers = async (_req: Request, res: Response) => {
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

const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin dashboard stats" });
  }
};

export const adminController = {
  getUsers,
  changeUserStatus,
  getStatistics,
};
