import { createAccessControl } from "better-auth/plugins";

export const statement = {
  user: ["create", "read", "update", "delete"],
  tutorProfile: ["create", "read", "update", "delete"],
  booking: ["create", "read", "update", "delete", "cancel"],
  subjectCategory: ["create", "read", "update", "delete"],
  review: ["create", "read", "update", "delete"],
} as const;

const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  user: ["create", "read", "update", "delete"],
  tutorProfile: ["create", "read", "update", "delete"],
  booking: ["create", "read", "update", "delete", "cancel"],
  subjectCategory: ["create", "read", "update", "delete"],
  review: ["read", "delete"],
});

export const tutorRole = ac.newRole({
  user: ["read"],
  tutorProfile: ["create", "read", "update"], 
  booking: ["read", "update", "cancel"],
  subjectCategory: ["read"],
  review: ["read"],
});

export const studentRole = ac.newRole({
  user: ["read"],
  tutorProfile: ["read"],
  booking: ["create", "read", "cancel"],
  subjectCategory: ["read"],
  review: ["create", "read", "update"],
});

