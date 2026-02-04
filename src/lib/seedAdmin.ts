import { auth } from "./auth"; 
import { prisma } from "./prisma";

async function seedAdmin() {
  const email = "admin@gmail.com";
  const password = "123456";

  try {
    //  Using  Better Auth Internal API 
    await auth.api.createUser({
      body: {
        email,
        password,
        name: "Admin",
        role: "ADMIN",
      },
    });

    // verify the email manually
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });

    console.log("Admin seeded successfully!!");
  } catch (error) {
    console.error("Seeding failed:", error);
  }
}

// seedAdmin();