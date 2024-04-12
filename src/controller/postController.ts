import { Response } from "express";
import {
  RegisterWithUserAndFile,
  RequestWithUser,
} from "../../src/infrastructure/types";
import { matchedData, validationResult } from "express-validator";
import PostService from "../../src/domain/services/postService";
import ImageService from "../../src/domain/services/imageService";
import { UserServices } from "../../src/domain/services/userService";
import { Role } from "@prisma/client";
import { PostUpdateDTO } from "../../src/dtos/postDTOs";
import PostCategoriesService from "../../src/domain/services/postCategoryService";
import { logger } from "../../src/infrastructure/config/logger";

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

    const post = await PostService.getById(postId);

    if (post) {
      /*
      If the post already exists, we upload the image to the post, if its their post
      */
      if (post.userId !== user.id) {
        return res.status(403).json({
          message: req.t("post.unauthorized"),
        });
      }

      try {
        await ImageService.uploadImage(postId, postImage.path);
      } catch (err) {
        return res.status(500).json({
          message: req.t("internal_server_error"),
        });
      }
    }

    if (!post) {
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

  static async getPostDetailsById(req: RequestWithUser, res: Response) {
    const postId = req.params.id;
    const authUser = req.user;

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    const post = await PostService.getByIdAndUser(postId, user.id);
    if (!post) {
      return res.status(404).json({
        message: req.t("post.not_found"),
      });
    }

    return res.status(200).json({
      data: post,
    });
  }

  static async updatePostById(req: RequestWithUser, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const postId = req.params.id;
    const authUser = req.user;

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    const post = await PostService.getByIdAndUser(postId, user.id);
    if (!post) {
      return res.status(404).json({
        message: req.t("post.not_found"),
      });
    }

    if (post.userId !== user.id) {
      return res.status(403).json({
        message: req.t("post.unauthorized"),
      });
    }

    if (data.category) {
      const category = await PostCategoriesService.getById(data.category);
      if (!category) {
        return res.status(404).json({
          message: req.t("post_category.not_found"),
        });
      }
    }

    const postData: PostUpdateDTO = {
      title: data.title,
      content: data.content,
      category: data.category,
    };

    try {
      const postUpdated = await PostService.updatePost(post, postData);
      return res.status(200).json({
        message: req.t("post.updated"),
        data: postUpdated,
      });
    } catch (err) {
      logger.error("Error while updating post: ", err);
      return res.status(500).json({
        message: req.t("internal_server_error"),
      });
    }
  }

  static async deletePostById(req: RequestWithUser, res: Response) {
    const postId = req.params.id;
    const authUser = req.user;

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    const post = await PostService.getByIdAndUser(postId, user.id);
    if (!post) {
      return res.status(404).json({
        message: req.t("post.not_found"),
      });
    }

    if (post.userId !== user.id) {
      return res.status(403).json({
        message: req.t("post.unauthorized"),
      });
    }

    await PostService.deleteById(postId);

    return res.status(200).json({
      message: req.t("post.deleted"),
    });
  }

  static async getPostsFromSpecificUser(req: RequestWithUser, res: Response) {
    const authUser = req.user;
    const userId = req.params.id;

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    if (user.role !== Role.ADMIN) {
      return res.status(403).json({
        message: req.t("auth.not_enough_access"),
      });
    }

    const userToSearchPosts = await UserServices.findById(userId);
    if (!userToSearchPosts) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    const posts = await PostService.getAllFromUser(userId);

    return res.status(200).json({
      data: posts,
    });
  }
}
