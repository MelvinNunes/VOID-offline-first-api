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
}
