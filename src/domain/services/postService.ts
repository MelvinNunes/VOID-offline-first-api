import { Post, PrismaClient } from "@prisma/client";
import {
  PostCreateOrUpdate,
  PostDTO,
  PostUpdateDTO,
} from "../../../src/dtos/postDTOs";
import { logger } from "../../../src/infrastructure/config/logger";
import PostCategoriesService from "./postCategoryService";

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

  static async createManyPosts(posts: PostDTO[], userId: string) {
    const failedPosts: PostDTO[] = [];

    for (const post of posts) {
      const dto: PostCreateOrUpdate = {
        postId: post.id,
        userId: userId,
        category: post.category,
        content: post.content,
        title: post.title,
      };
      try {
        const categoryExists = await PostCategoriesService.existsById(
          post.category
        );
        if (!categoryExists) {
          throw new Error(`Cannot find category with id: ${post.category}`);
        }
        await this.createOrUpdatePost(dto);
      } catch (err) {
        failedPosts.push(post);
        // Log the info
        logger.error(`Post ID: ${post.id}`);
        logger.error(`Error while saving post: ${err}`);
      }
    }

    return failedPosts;
  }

  static async createOrUpdatePost(dto: PostCreateOrUpdate) {
    return await prisma.post.upsert({
      create: {
        id: dto.postId,
        userId: dto.userId,
        body: dto.content,
        categoryId: dto.category,
        title: dto.title,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        title: dto.title,
        body: dto.content,
        categoryId: dto.category,
        updatedAt: new Date(),
      },
      where: {
        id: dto.postId,
      },
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
        category: true,
      },
    });
  }

  static async getByIdAndUser(id: string, userId: string): Promise<Post> {
    return await prisma.post.findFirst({
      where: { id: id, userId: userId },
      include: {
        images: true,
        category: true,
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

  static checkIfThereArePosts(posts: PostDTO[]) {
    var thereArePosts = false;
    posts.forEach((post) => {
      if (Object.keys(post).length !== 0) {
        thereArePosts = true;
      }
    });
    return thereArePosts;
  }

  static checkIfThereAreAnyValidPosts(posts: PostDTO[]) {
    var thereAreValidPosts = false;
    posts.forEach((post) => {
      if (
        post.id !== undefined &&
        post.content !== undefined &&
        post.category !== undefined
      ) {
        thereAreValidPosts = true;
      }
    });
    return thereAreValidPosts;
  }
}
