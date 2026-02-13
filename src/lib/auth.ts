import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { admin } from "better-auth/plugins";
import { adminRole, studentRole, tutorRole } from "./permissions";

export const auth = betterAuth({
  appName: "Skill Bridge",
  baseURL: process.env.BETTER_AUTH_URL! || "http://localhost:5000",
  basePath: "/api/auth",

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000",
      "https://skill-bridge-connect.vercel.app",
      "https://skill-bridge-server-beta.vercel.app",
    ].filter(Boolean);

    // Check if origin matches allowed origins or Vercel pattern
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }

    return [];
  },

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

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    cookie: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    }
  },

  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true,
  },
});
