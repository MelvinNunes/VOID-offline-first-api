import { Post, PrismaClient } from "@prisma/client";
import { PostDTO } from "../../../src/dtos/postDTOs";

const prisma = new PrismaClient();

export default class PostService {
  static async createManyPosts(posts: PostDTO[]) {
    // build posts
    const builtPosts = posts.map((post) => {
      return {
        id: post.id,
        userId: post.userId,
        body: post.content,
        categoryId: post.category,
        title: post.title,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return await prisma.post.createMany({
      data: builtPosts,
    });
  }

  static async getAllFromUser(userId: string): Promise<Post[]> {
    return await prisma.post.findMany({
      where: { userId: userId },
    });
  }

  static async getAll() {
    return await prisma.post.findMany();
  }

  static async getById(id: string): Promise<Post> {
    return await prisma.post.findFirst({
      where: { id: id },
    });
  }

  static async existsById(id: string): Promise<boolean> {
    const post = await prisma.post.findFirst({
      where: { id: id },
    });
    return post != null;
  }
}
