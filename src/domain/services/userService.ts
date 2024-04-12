import { PrismaClient } from "@prisma/client";
import { UserDTO } from "../../../src/dtos/userDTOs";

const prisma = new PrismaClient();

export class UserServices {
  static async createUser(user: UserDTO) {
    const userData = {
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await prisma.user.create({
      data: userData,
    });
    return userData;
  }

  static async getAllUsers() {
    return await prisma.user.findMany();
  }

  static async existsByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    return user != null;
  }

  static async findByEmail(email: string) {
    return await prisma.user.findFirst({
      where: { email: email },
    });
  }
}
