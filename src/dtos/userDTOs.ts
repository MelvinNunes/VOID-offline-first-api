import { Role } from "@prisma/client";

export type UserDTO = {
  name: string;
  email: string;
  password: string;
  role: Role;
};
