import { Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { userService } from "./user.service";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: Role;
    [key: string]: any;
  };
}

export const updateRoleController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
   
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user session found" });
    }
    // console.log(user);

    const { role } = req.body;
    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    if (user.role === role) {
      return res.status(200).json({ message: "Role is already set", user });
    }

    const updatedUser = await userService.updateUserRole(user.id, role as "TUTOR" | "STUDENT");

    return res.status(200).json({
      message: `Role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (err: any) {
    console.error("updateRoleController error:", err);
    return res.status(500).json({
      message: err.message || "Failed to update role",
    });
  }
};
