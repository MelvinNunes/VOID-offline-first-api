import { Response } from "express";
import { RequestWithUser } from "../../src/infrastructure/types";
import { matchedData, validationResult } from "express-validator";
import PostService from "../../src/domain/services/postService";

export default class PostController {
  static async createPost(req: RequestWithUser, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const posts = data.posts;

    try {
      await PostService.createManyPosts(posts);
    } catch (err) {
      return res.status(500).json({
        message: "Internal server error while creating posts!",
      });
    }

    return res.status(201).json({
      message: "Posts where created successfully!.",
    });
  }

  static async uploadImageToPost(req: RequestWithUser, res: Response) {}

  static async getAllPosts(req: RequestWithUser, res: Response) {}

  static async getPostDetailsById(req: RequestWithUser, res: Response) {}

  static async updatePostById(req: RequestWithUser, res: Response) {}

  static async deletePostById(req: RequestWithUser, res: Response) {}

  static async getPostsFromSpecificUser(req: RequestWithUser, res: Response) {}
}
