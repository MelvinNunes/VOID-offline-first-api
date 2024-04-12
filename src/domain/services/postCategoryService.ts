import { PostCategory, PrismaClient } from "@prisma/client";
import { logger } from "../../../src/infrastructure/config/logger";

const prisma = new PrismaClient();

export default class PostCategoriesService {
  static async create(name: string, userId: string) {
    const postCategory = {
      name: name,
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      return await prisma.postCategory.create({
        data: postCategory,
      });
    } catch (err) {
      logger.error("Error while saving post category: ", err);
    }
  }

  static async getAll() {
    return await prisma.postCategory.findMany();
  }

  static async getById(id: number) {
    return await prisma.postCategory.findFirst({
      where: { id: id },
    });
  }

  static async update(postCategory: PostCategory, name: string) {
    postCategory.name = name;
    postCategory.updatedAt = new Date();

    return await prisma.postCategory.update({
      where: {
        id: postCategory.id,
      },
      data: postCategory,
    });
  }

  static async delete(id: number) {
    return await prisma.postCategory.delete({
      where: {
        id: id,
      },
    });
  }

  static async existsByName(name: string) {
    const postCategory = await prisma.postCategory.findFirst({
      where: { name: name },
    });
    return postCategory != null;
  }

  static async existsById(id: number) {
    const postCategory = await prisma.postCategory.findFirst({
      where: { id: id },
    });
    return postCategory != null;
  }
}
