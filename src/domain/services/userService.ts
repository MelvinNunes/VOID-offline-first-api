import { PrismaClient } from "@prisma/client";
import { UserDTO } from "../../../src/dtos/userDTOs";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../../src/infrastructure/config/logger";

const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

export class UserServices {
  static async createUser(user: UserDTO) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    const userData = {
      email: user.email,
      password: hashedPassword,
      role: user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await prisma.user.create({
        data: userData,
      });
    } catch (err) {
      logger.error("Error while saving user: ", err);
    }

    try {
      // to refactor
      const createdUser = await prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });

      await prisma.profile.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          userId: createdUser.id,
        },
      });
    } catch (err) {
      logger.error("Error while saving profile: ", err);
    }

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

  static async findById(id: string) {
    return await prisma.user.findFirst({
      where: { id: id },
    });
  }
}
