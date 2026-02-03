import { prisma } from "./prisma";
import { hashPassword } from "better-auth/crypto"; 

async function seedAdmin() {
  try {
    const email = "admin@gmail.com";

    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Admin already exists. Skipping seed.");
      return;
    }

    const hashedPassword = await hashPassword("123456");

    await prisma.user.create({
      data: {
        name: "Admin",
        email: email,
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Admin seeding done!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();