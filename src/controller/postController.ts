import { Response } from "express";
import {
  RegisterWithUserAndFile,
  RequestWithUser,
} from "../../src/infrastructure/types";
import { matchedData, validationResult } from "express-validator";
import PostService from "../../src/domain/services/postService";
import ImageService from "../../src/domain/services/imageService";
import { UserServices } from "../../src/domain/services/userService";

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

  static async uploadImageToPost(req: RegisterWithUserAndFile, res: Response) {
    const postId = req.params.id;
    const postImage = req.file;

    if (!postImage) {
      return res.status(400).json({
        message: req.t("post.image_not_found"),
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const authUser = req.user;

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    const postExists = await PostService.existsById(postId);

    if (postExists) {
      /*
      If the post already exists, we upload the image to the post
      */
      try {
        await ImageService.uploadImage(postId, postImage.path);
      } catch (err) {
        return res.status(500).json({
          message: req.t("internal_server_error"),
        });
      }
    }

    if (!postExists) {
      /*
      If the post doesnt exists, we upload the image with temporary relation (not actual relation)
      */
      try {
        await ImageService.uploadTempImage(postId, postImage.path);
      } catch (err) {
        return res.status(500).json({
          message: req.t("internal_server_error"),
        });
      }

      /*
      If its an image only post, we create the post
      */
      if (data.is_post) {
        await PostService.createPostViaImage(user.id, postId);
        return res.status(201).json({
          message: req.t("post.created"),
        });
      }
    }

    return res.status(201).json({
      message: req.t("post.image_uploaded"),
    });
  }

  static async getAllPosts(req: RequestWithUser, res: Response) {}

  static async getPostDetailsById(req: RequestWithUser, res: Response) {}

  static async updatePostById(req: RequestWithUser, res: Response) {}

  static async deletePostById(req: RequestWithUser, res: Response) {}

  static async getPostsFromSpecificUser(req: RequestWithUser, res: Response) {}
}
