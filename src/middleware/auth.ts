import { Request, Response, NextFunction } from "express";
import { auth as betterAuth } from "../lib/auth";


type Resource = "user" | "tutorProfile" | "booking" | "subjectCategory" | "review";

const auth = (resource: Resource, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const session = await betterAuth.api.getSession({
        headers: req.headers,
      });
      
      if (!session) {
        return res.status(401).send({ message: "Unauthorized!" });
      }

      const role = (session.user.role === null || session.user.role === undefined)
        ? undefined
        : (session.user.role as "STUDENT" | "TUTOR" | "ADMIN" );

      const hasPermission = await betterAuth.api.userHasPermission({
        body: {
          userId: session.user.id,
          role,
          permission: { [resource]: [action] },
        },
      });

      if (!hasPermission || !hasPermission.success) {
        return res.status(403).send({ 
          message: `Forbidden: You do not have permission to ${action} ${resource}!`,
        });
      }

      (req as any).user = session.user;

      next();

    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  };
};

export default auth;