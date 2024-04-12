import { Post, PrismaClient } from "@prisma/client";
import { PostDTO, PostUpdateDTO } from "../../../src/dtos/postDTOs";
import { logger } from "../../../src/infrastructure/config/logger";

const prisma = new PrismaClient();

export default class PostService {
  static async createPostViaImage(userId: string, postId: string) {
    try {
      return await prisma.post.create({
        data: {
          id: postId,
          userId: userId,
          body: null,
          categoryId: null,
          title: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      logger.error("Error while saving post: ", err);
    }
  }

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

  static async updatePost(post: Post, data: PostUpdateDTO): Promise<Post> {
    post.title = data.title;
    post.body = data.content;
    post.categoryId = data.category;
    post.updatedAt = new Date();

    return await prisma.post.update({
      where: { id: post.id },
      data: {
        body: post.body,
        title: post.title,
        categoryId: post.categoryId,
        updatedAt: post.updatedAt,
      },
    });
  }

  static async getAllFromUser(userId: string): Promise<Post[]> {
    return await prisma.post.findMany({
      where: { userId: userId },
      include: {
        images: true,
      },
    });
  }

  static async getAll() {
    return await prisma.post.findMany();
  }

  static async getById(id: string): Promise<Post> {
    return await prisma.post.findFirst({
      where: { id: id },
      include: {
        images: true,
      },
    });
  }

  static async getByIdAndUser(id: string, userId: string): Promise<Post> {
    return await prisma.post.findFirst({
      where: { id: id, userId: userId },
      include: {
        images: true,
      },
    });
  }

  static async existsById(id: string): Promise<boolean> {
    const post = await prisma.post.findFirst({
      where: { id: id },
    });
    return post != null;
  }

  static async deleteById(id: string): Promise<Post> {
    return await prisma.post.delete({
      where: { id: id },
    });
  }
}
