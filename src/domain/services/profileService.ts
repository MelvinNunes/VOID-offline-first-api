import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ProfileService {
  static async findByUserId(userId: string) {
    return await prisma.profile.findFirst({
      where: { userId: userId },
    });
  }
}
