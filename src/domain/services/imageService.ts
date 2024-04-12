import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class ImageService {
  static async createImage(image: any) {
    return await prisma.image.create({ data: image });
  }
}
