import { Role } from "@prisma/client";

export type UserDTO = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  password: string;
  role: Role;
};

export type UserVM = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  role: Role;
};
