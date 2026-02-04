import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { adminRole, studentRole, tutorRole } from "./permissions";

export const auth = betterAuth({
  appName: "Skill Bridge",
  baseURL: process.env.BETTER_AUTH_URL!,
  basePath: "/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [process.env.FRONTEND_URL!],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: true,
      },
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  plugins: [
    admin({
      adminRoles: ["ADMIN"],
      defaultRole: "STUDENT",
      roles: {
        ADMIN: adminRole,
        TUTOR: tutorRole,
        STUDENT: studentRole,
      },
    }),
  ],
});
