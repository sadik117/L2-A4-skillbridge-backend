// src/app.ts
import express from "express";
import cors from "cors";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'generator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum BookingStatus {\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum Status {\n  ACTIVE\n  BANNED\n}\n\nmodel User {\n  id            String  @id @default(uuid())\n  name          String\n  email         String  @unique\n  password      String?\n  image         String?\n  emailVerified Boolean @default(false)\n  role          Role    @default(STUDENT)\n  status        Status  @default(ACTIVE)\n\n  tutorProfile TutorProfile?\n  bookings     Booking[]     @relation("StudentBookings")\n  reviews      Review[]\n  sessions     Session[]\n  accounts     Account[]\n\n  banned Boolean @default(false)\n\n  createdAt  DateTime  @default(now())\n  updatedAt  DateTime  @updatedAt\n  banReason  String?\n  banExpires DateTime?\n\n  @@map("User")\n}\n\nmodel TutorProfile {\n  id         String          @id @default(uuid())\n  userId     String          @unique\n  user       User            @relation(fields: [userId], references: [id])\n  categoryId String\n  category   SubjectCategory @relation(fields: [categoryId], references: [id])\n\n  bio        String\n  hourlyRate Int\n  experience Int\n\n  availability AvailabilitySlot[]\n  bookings     Booking[]          @relation("TutorBookings")\n  reviews      Review[]\n\n  createdAt DateTime @default(now())\n\n  @@map("TutorProfile")\n}\n\nmodel SubjectCategory {\n  id String @id @default(uuid())\n\n  name     String\n  slug     String  @unique\n  isActive Boolean @default(true)\n\n  tutors TutorProfile[]\n\n  createdAt DateTime @default(now())\n\n  @@map("subject_category")\n}\n\nmodel AvailabilitySlot {\n  id String @id @default(uuid())\n\n  tutorProfileId String\n  tutorProfile   TutorProfile @relation(fields: [tutorProfileId], references: [id], onDelete: Cascade)\n\n  isBooked Boolean @default(false)\n\n  startTime  DateTime\n  endTime    DateTime\n  daysOfWeek String[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("availability_slot")\n}\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  studentId String\n  student   User   @relation("StudentBookings", fields: [studentId], references: [id])\n\n  tutorId String\n  tutor   TutorProfile @relation("TutorBookings", fields: [tutorId], references: [id])\n\n  startTime DateTime\n  endTime   DateTime\n  status    BookingStatus @default(CONFIRMED)\n\n  review Review?\n\n  createdAt DateTime @default(now())\n\n  @@map("Booking")\n}\n\nmodel Review {\n  id String @id @default(uuid())\n\n  rating  Int\n  comment String\n\n  studentId String\n  student   User   @relation(fields: [studentId], references: [id])\n\n  tutorId String\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id])\n\n  bookingId String  @unique\n  booking   Booking @relation(fields: [bookingId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@map("Review")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  impersonatedBy String?\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"Status"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"bookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"banned","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"banReason","kind":"scalar","type":"String"},{"name":"banExpires","kind":"scalar","type":"DateTime"}],"dbName":"User"},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"SubjectCategory","relationName":"SubjectCategoryToTutorProfile"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Int"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"availability","kind":"object","type":"AvailabilitySlot","relationName":"AvailabilitySlotToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"TutorBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"TutorProfile"},"SubjectCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"tutors","kind":"object","type":"TutorProfile","relationName":"SubjectCategoryToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"subject_category"},"AvailabilitySlot":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"AvailabilitySlotToTutorProfile"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"daysOfWeek","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"availability_slot"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorBookings"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"Booking"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"Review"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"},{"name":"impersonatedBy","kind":"scalar","type":"String"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  STUDENT: "STUDENT",
  TUTOR: "TUTOR",
  ADMIN: "ADMIN"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables");
}
var adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
var globalForPrisma = global;
var prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter
});
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// src/lib/auth.ts
import { admin } from "better-auth/plugins";

// src/lib/permissions.ts
import { createAccessControl } from "better-auth/plugins";
var statement = {
  user: ["create", "read", "update", "delete"],
  tutorProfile: ["create", "read", "update", "delete"],
  booking: ["create", "read", "update", "delete", "cancel"],
  subjectCategory: ["create", "read", "update", "delete"],
  review: ["create", "read", "update", "delete"]
};
var ac = createAccessControl(statement);
var adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"],
  tutorProfile: ["create", "read", "update", "delete"],
  booking: ["create", "read", "update", "delete", "cancel"],
  subjectCategory: ["create", "read", "update", "delete"],
  review: ["read", "delete"]
});
var tutorRole = ac.newRole({
  user: ["read", "update"],
  tutorProfile: ["create", "read", "update"],
  booking: ["read", "update", "cancel"],
  subjectCategory: ["read"],
  review: ["read"]
});
var studentRole = ac.newRole({
  user: ["read", "update"],
  tutorProfile: ["read"],
  booking: ["create", "read", "cancel"],
  subjectCategory: ["read"],
  review: ["create", "read", "update"]
});

// src/lib/auth.ts
var auth = betterAuth({
  appName: "Skill Bridge",
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.FRONTEND_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        input: true
      },
      banned: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6
  },
  plugins: [
    admin({
      adminRoles: ["ADMIN"],
      defaultRole: "STUDENT",
      roles: {
        ADMIN: adminRole,
        TUTOR: tutorRole,
        STUDENT: studentRole
      }
    })
  ]
});

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/routes/routes.ts
import { Router as Router8 } from "express";

// src/modules/tutor/tutor.routes.ts
import { Router } from "express";

// src/modules/tutor/tutor.service.ts
var upsertTutorProfile = async (userId, data) => {
  const { bio, hourlyRate, experience, categoryId } = data;
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio,
      hourlyRate,
      experience,
      category: {
        connect: { id: categoryId }
      }
    },
    create: {
      bio,
      hourlyRate,
      experience,
      user: { connect: { id: userId } },
      category: { connect: { id: categoryId } }
    }
  });
};
var createAvailabilitySlots = async (tutorProfileId, slots) => {
  if (!slots || slots.length === 0) {
    throw new Error("No availability slots provided");
  }
  return prisma.availabilitySlot.createMany({
    data: slots.map((slot) => ({
      tutorProfileId,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
      daysOfWeek: slot.daysOfWeek
    })),
    skipDuplicates: true
  });
};
var getTutorBookings = async (tutorProfileId) => {
  return prisma.booking.findMany({
    where: { tutorId: tutorProfileId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};
var getTutor = async (filters) => {
  const { search, categoryId } = filters;
  return prisma.tutorProfile.findMany({
    where: {
      AND: [
        categoryId ? { categoryId } : {},
        search ? {
          OR: [
            { bio: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            { user: { name: { contains: search, mode: "insensitive" } } }
          ]
        } : {}
      ]
    },
    include: {
      user: true,
      category: true,
      reviews: true
    }
  });
};
var getAllTutors = async () => {
  return prisma.tutorProfile.findMany({
    include: { user: true, category: true, reviews: true }
  });
};
var getTutorDetails = async (id) => {
  return prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: true,
      category: true,
      reviews: {
        include: {
          student: { select: { id: true, name: true } }
        }
      },
      availability: true
    }
  });
};
var getMyProfile = async (userId) => {
  return prisma.tutorProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      availability: true,
      reviews: {
        include: {
          student: { select: { id: true, name: true } }
        }
      },
      category: true
    }
  });
};
var getFeaturedTutors = async () => {
  const tutors = await prisma.tutorProfile.findMany({
    take: 6,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      category: true,
      reviews: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return tutors.map((tutor) => {
    const avgRating = tutor.reviews.length > 0 ? tutor.reviews.reduce((sum, r) => sum + r.rating, 0) / tutor.reviews.length : 0;
    return {
      ...tutor,
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews: tutor.reviews.length
    };
  });
};
var tutorService = {
  upsertTutorProfile,
  createAvailabilitySlots,
  getTutorBookings,
  getTutor,
  getTutorDetails,
  getMyProfile,
  getAllTutors,
  getFeaturedTutors
};

// src/modules/tutor/tutor.controller.ts
var upsertProfile = async (req, res) => {
  const userId = req.user.id;
  const profile = await tutorService.upsertTutorProfile(userId, req.body);
  res.status(200).json({
    success: true,
    message: "Tutor profile saved",
    data: profile
  });
};
var setAvailability = async (req, res) => {
  const userId = req.user.id;
  const tutorProfile2 = await tutorService.getMyProfile(userId);
  if (!tutorProfile2) {
    return res.status(403).json({
      success: false,
      message: "Tutor profile not found"
    });
  }
  const { slots } = req.body;
  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Slots must be a non-empty array"
    });
  }
  await tutorService.createAvailabilitySlots(tutorProfile2.id, slots);
  res.status(201).json({
    success: true,
    message: "Availability slots added"
  });
};
var tutorSessions = async (req, res) => {
  const tutorProfileId = req.user?.tutorProfile?.id;
  if (!tutorProfileId) {
    return res.status(403).json({
      success: false,
      message: "Tutor profile not found"
    });
  }
  const sessions = await tutorService.getTutorBookings(tutorProfileId);
  res.status(200).json({
    success: true,
    data: sessions
  });
};
var getTutor2 = async (req, res) => {
  const tutors = await tutorService.getTutor({
    search: req.query.search,
    categoryId: req.query.categoryId
  });
  res.status(200).json({
    success: true,
    data: tutors
  });
};
var tutorProfile = async (req, res) => {
  const { tutorId } = req.params;
  if (!tutorId)
    return res.status(400).json({
      success: false,
      message: "Tutor id is required"
    });
  try {
    const tutor = await tutorService.getTutorDetails(tutorId);
    if (!tutor) {
      return res.status(404).json({ success: false, message: "Tutor not found" });
    }
    res.json({ success: true, data: tutor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
var getAllTutors2 = async (req, res) => {
  const tutors = await tutorService.getAllTutors();
  res.status(200).json({
    success: true,
    data: tutors
  });
};
var getMyProfile2 = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  const tutor = await tutorService.getMyProfile(userId);
  res.json({ success: true, data: tutor });
};
var getFeaturedTutors2 = async (req, res) => {
  const tutors = await tutorService.getFeaturedTutors();
  res.json({ success: true, data: tutors });
};
var tutorController = {
  upsertProfile,
  setAvailability,
  tutorSessions,
  getTutor: getTutor2,
  tutorProfile,
  getMyProfile: getMyProfile2,
  getAllTutors: getAllTutors2,
  getFeaturedTutors: getFeaturedTutors2
};

// src/middleware/auth.ts
var auth2 = (resource, action) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
      const role = session.user.role;
      const hasPermission = await auth.api.userHasPermission({
        body: {
          userId: session.user.id,
          role,
          permission: { [resource]: [action] }
        }
      });
      if (!hasPermission || !hasPermission.success) {
        return res.status(403).json({
          message: `Forbidden: You do not have permission to ${action} ${resource}!`
        });
      }
      req.user = session.user;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
var auth_default = auth2;

// src/modules/tutor/tutor.routes.ts
var tutorRouter = Router();
tutorRouter.get("/", tutorController.getTutor);
tutorRouter.get("/browse-tutors", tutorController.getAllTutors);
tutorRouter.post("/profile", auth_default("tutorProfile", "update"), tutorController.upsertProfile);
tutorRouter.post("/set-availability", auth_default("tutorProfile", "create"), tutorController.setAvailability);
tutorRouter.get("/sessions", auth_default("booking", "read"), tutorController.tutorSessions);
tutorRouter.get("/profile/:tutorId", tutorController.tutorProfile);
tutorRouter.get("/my-profile", auth_default("tutorProfile", "read"), tutorController.getMyProfile);
tutorRouter.get("/featured", tutorController.getFeaturedTutors);
var tutor_routes_default = tutorRouter;

// src/modules/admin/admin.routes.ts
import { Router as Router2 } from "express";

// src/modules/admin/admin.service.ts
var getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });
};
var updateUserStatus = async (id, status) => {
  return prisma.user.update({
    where: { id },
    data: { status }
  });
};
var getDashboardStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalTutors = await prisma.tutorProfile.count();
  const totalBookings = await prisma.booking.count();
  const confirmedBookings = await prisma.booking.count({ where: { status: "CONFIRMED" } });
  const completedBookings = await prisma.booking.count({ where: { status: "COMPLETED" } });
  const totalReviews = await prisma.review.count();
  return {
    totalUsers,
    totalStudents,
    totalTutors,
    totalBookings,
    completedBookings,
    confirmedBookings,
    totalReviews
  };
};
var adminService = {
  getAllUsers,
  updateUserStatus,
  getDashboardStats
};

// src/modules/admin/admin.controller.ts
var getUsers = async (_req, res) => {
  const users = await adminService.getAllUsers();
  res.status(200).json({ success: true, data: users });
};
var changeUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedUser = await adminService.updateUserStatus(id, status);
  res.status(200).json({
    success: true,
    message: `User status updated to ${status}`,
    data: updatedUser
  });
};
var getStatistics = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch admin dashboard stats" });
  }
};
var adminController = {
  getUsers,
  changeUserStatus,
  getStatistics
};

// src/modules/admin/admin.routes.ts
var adminRouter = Router2();
adminRouter.get("/all-users", auth_default("user", "read"), adminController.getUsers);
adminRouter.patch("/user-status/:id", auth_default("user", "update"), adminController.changeUserStatus);
adminRouter.get("/dashboard-stats", adminController.getStatistics);
var admin_routes_default = adminRouter;

// src/modules/booking/booking.routes.ts
import { Router as Router3 } from "express";

// src/modules/booking/booking.service.ts
var createBooking = async (studentId, tutorId, slotId) => {
  return prisma.$transaction(async (tx) => {
    const slot = await tx.availabilitySlot.findUnique({
      where: { id: slotId }
    });
    if (!slot) {
      throw new Error("Availability slot not found");
    }
    if (slot.isBooked) {
      throw new Error("Slot already booked");
    }
    await tx.availabilitySlot.update({
      where: { id: slotId },
      data: { isBooked: true }
    });
    return tx.booking.create({
      data: {
        studentId,
        tutorId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: "CONFIRMED"
      }
    });
  });
};
var getTutorBookings2 = async (tutorId) => {
  return prisma.booking.findMany({
    where: { tutorId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { startTime: "desc" }
  });
};
var completeSession = async (bookingId) => {
  return prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: "COMPLETED"
    }
  });
};
var getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      student: true,
      tutor: { include: { user: true } }
    }
  });
};
var bookingService = {
  createBooking,
  getTutorBookings: getTutorBookings2,
  completeSession,
  getAllBookings
};

// src/modules/booking/booking.controller.ts
var bookSession = async (req, res) => {
  const studentId = req.user.id;
  const { tutorId, slotId } = req.body;
  const booking = await bookingService.createBooking(
    studentId,
    tutorId,
    slotId
  );
  res.status(201).json({ success: true, data: booking });
};
var tutorBookings = async (req, res) => {
  const tutorId = req.user.id;
  const tutorProfile2 = await tutorService.getMyProfile(tutorId);
  if (!tutorProfile2) {
    return res.status(403).json({ success: false, message: "Tutor profile not found" });
  }
  const bookings = await bookingService.getTutorBookings(tutorProfile2.id);
  res.json({ success: true, data: bookings });
};
var completeSession2 = async (req, res) => {
  const bookingId = req.params.id;
  if (!bookingId) {
    return res.status(400).json({
      success: false,
      message: "Booking ID is required"
    });
  }
  const booking = await bookingService.completeSession(bookingId);
  res.status(200).json({
    success: true,
    data: booking
  });
};
var allBookings = async (req, res) => {
  const bookings = await bookingService.getAllBookings();
  res.json({ success: true, data: bookings });
};
var bookingController = {
  bookSession,
  tutorBookings,
  allBookings,
  completeSession: completeSession2
};

// src/modules/booking/booking.routes.ts
var bookingRouter = Router3();
bookingRouter.post("/book-session", auth_default("booking", "create"), bookingController.bookSession);
bookingRouter.get("/tutor-bookings", auth_default("booking", "read"), bookingController.tutorBookings);
bookingRouter.patch(
  "/complete/:id",
  auth_default("booking", "update"),
  bookingController.completeSession
);
bookingRouter.get("/all-bookings", auth_default("booking", "read"), bookingController.allBookings);
var booking_routes_default = bookingRouter;

// src/modules/category/category.routes.ts
import { Router as Router4 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (name, slug) => {
  return prisma.subjectCategory.create({
    data: { name, slug }
  });
};
var getCategories = async () => {
  return prisma.subjectCategory.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });
};
var categoryService = {
  createCategory,
  getCategories
};

// src/modules/category/category.controller.ts
var addCategory = async (req, res) => {
  const { name, slug } = req.body;
  const category = await categoryService.createCategory(name, slug);
  res.status(201).json({ success: true, data: category });
};
var getCategories2 = async (req, res) => {
  const categories = await categoryService.getCategories();
  res.json({ success: true, data: categories });
};
var categoryController = {
  addCategory,
  getCategories: getCategories2
};

// src/modules/category/category.routes.ts
var categoryRouter = Router4();
categoryRouter.post("/", auth_default("subjectCategory", "create"), categoryController.addCategory);
categoryRouter.get("/", categoryController.getCategories);
var category_routes_default = categoryRouter;

// src/modules/review/review.routes.ts
import { Router as Router5 } from "express";

// src/error.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/modules/review/review.service.ts
var createReview = async (studentId, bookingId, rating, comment) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { review: true }
  });
  if (!booking) {
    throw new AppError(404, "Booking not found");
  }
  if (booking.studentId !== studentId) {
    throw new AppError(403, "You can only review your own bookings");
  }
  if (booking.status !== "COMPLETED") {
    throw new AppError(400, "You can only review completed sessions");
  }
  if (booking.review) {
    throw new AppError(409, "You already reviewed this session");
  }
  return prisma.review.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      bookingId,
      rating,
      comment
    }
  });
};
var reviewService = {
  createReview
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const review = await reviewService.createReview(
    req.user.id,
    bookingId,
    rating,
    comment
  );
  res.status(201).json({ success: true, data: review });
};
var reviewController = {
  createReview: createReview2
};

// src/modules/review/review.routes.ts
var reviewRouter = Router5();
reviewRouter.post("/", auth_default("review", "create"), reviewController.createReview);
var review_routes_default = reviewRouter;

// src/modules/student/student.routes.ts
import { Router as Router6 } from "express";

// src/modules/student/student.service.ts
var getStudentProfile = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      bookings: {
        include: {
          tutor: { include: { user: true, category: true } }
        },
        orderBy: { startTime: "desc" }
      },
      reviews: true
    }
  });
};
var getStudentBookings = async (studentId) => {
  return prisma.booking.findMany({
    where: { studentId },
    include: {
      tutor: { include: { user: true, category: true } }
    },
    orderBy: { startTime: "desc" }
  });
};
var getAvailableSessions = async () => {
  return prisma.availabilitySlot.findMany({
    where: {
      isBooked: false
    },
    include: {
      tutorProfile: {
        include: {
          user: true,
          category: true
        }
      }
    },
    orderBy: {
      startTime: "asc"
    }
  });
};
var studentService = {
  getStudentProfile,
  getStudentBookings,
  getAvailableSessions
};

// src/modules/student/student.controller.ts
var myStudentProfile = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  const student = await studentService.getStudentProfile(userId);
  res.json({ success: true, data: student });
};
var studentBookings = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
  const bookings = await studentService.getStudentBookings(userId);
  res.json({ success: true, data: bookings });
};
var getAvailableSlots = async (req, res) => {
  const slots = await studentService.getAvailableSessions();
  res.json({
    success: true,
    data: slots
  });
};
var studentController = {
  myStudentProfile,
  studentBookings,
  getAvailableSlots
};

// src/modules/student/student.routes.ts
var studentRouter = Router6();
studentRouter.get("/my-profile", auth_default("user", "read"), studentController.myStudentProfile);
studentRouter.get("/my-bookings", auth_default("user", "read"), studentController.studentBookings);
studentRouter.get("/available-sessions", studentController.getAvailableSlots);
var student_routes_default = studentRouter;

// src/modules/user/user.routes.ts
import { Router as Router7 } from "express";

// src/modules/user/user.service.ts
var updateUserRole = async (userId, role) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role }
  });
};
var userService = {
  updateUserRole
};

// src/modules/user/user.controller.ts
var updateRoleController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user session found" });
    }
    const { role } = req.body;
    if (!role || !Object.values(Role).includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }
    if (user.role === role) {
      return res.status(200).json({ message: "Role is already set", user });
    }
    const updatedUser = await userService.updateUserRole(user.id, role);
    return res.status(200).json({
      message: `Role updated to ${role} successfully`,
      user: updatedUser
    });
  } catch (err) {
    console.error("updateRoleController error:", err);
    return res.status(500).json({
      message: err.message || "Failed to update role"
    });
  }
};

// src/modules/user/user.routes.ts
var userRouter = Router7();
userRouter.patch("/role", auth_default("user", "update"), updateRoleController);
var user_routes_default = userRouter;

// src/routes/routes.ts
var routes = Router8();
routes.use("/tutor", tutor_routes_default);
routes.use("/booking", booking_routes_default);
routes.use("/admin", admin_routes_default);
routes.use("/categories", category_routes_default);
routes.use("/review", review_routes_default);
routes.use("/student", student_routes_default);
routes.use("/user", user_routes_default);
var routes_default = routes;

// src/app.ts
import cookieParser from "cookie-parser";
var app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/v1", routes_default);
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
app.get("/", (req, res) => {
  res.send("Hello, You are in Skill Bridge!");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
