import { PrismaClient } from "@prisma/client";
import { logger } from "../../../src/infrastructure/config/logger";

const prisma = new PrismaClient();

export default class ImageService {
  static async uploadImage(postId: string, imageSrc: string) {
    try {
      return await prisma.image.create({
        data: {
          postId: postId,
          source: process.env.APP_DOMAIN + imageSrc,
          createdAt: new Date(),
          updatedAt: new Date(),
          temporaryPostId: postId,
        },
      });
    } catch (error) {
      logger.error("Error while saving image: ", error);
    }
  }

  static async uploadTempImage(tempPostId: string, imageSrc: string) {
    try {
      return await prisma.image.create({
        data: {
          temporaryPostId: tempPostId,
          source: imageSrc,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      logger.error("Error while saving image: ", error);
    }
  }

  static async getByTemporaryPostId(id: string) {
    try {
      return await prisma.image.findFirst({
        where: {
          temporaryPostId: id,
        },
      });
    } catch (error) {
      logger.error("Error while getting image: ", error);
    }
  }

  static async existsByTemporaryPostId(id: string) {
    const image = await prisma.image.findFirst({
      where: {
        temporaryPostId: id,
      },
    });
    return image != null;
  }

  static async updatePostRelationFromPostId(postId: string) {
    try {
      return await prisma.image.updateMany({
        where: {
          temporaryPostId: postId,
        },
        data: {
          postId: postId,
        },
      });
    } catch (error) {
      logger.error("Error while updating image: ", error);
    }
  }
}
