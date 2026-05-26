export const USER_TYPES = {
  STUDENT: "student",
  LECTURER: "lecturer",
  RESEARCHER: "researcher",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];
