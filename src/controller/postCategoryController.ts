import { Response } from "express";
import { RequestWithUser } from "../../src/infrastructure/types";
import { matchedData, validationResult } from "express-validator";
import PostCategoriesService from "../../src/domain/services/postCategoryService";
import { UserServices } from "../../src/domain/services/userService";
import { Role } from "@prisma/client";
import { logger } from "../../src/infrastructure/config/logger";

export default class PostCategoryController {
  static async createPostCategory(req: RequestWithUser, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    const authUser = req.user;

    const alreadyRegistered = await PostCategoriesService.existsByName(
      data.name
    );
    if (alreadyRegistered) {
      return res.status(409).json({
        message: req.t("post_category.already_exists"),
      });
    }

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

    try {
      await PostCategoriesService.create(data.name, user.id);
    } catch (err) {
      return res.status(500).json({
        message: req.t("post_category.internal_error"),
      });
    }

    return res.status(201).json({
      message: req.t("post_category.created"),
    });
  }

  static async getAllPostCategories(req: RequestWithUser, res: Response) {
    const categories = await PostCategoriesService.getAll();
    return res.status(200).json({
      data: categories,
    });
  }

  static async getPostCategoryById(req: RequestWithUser, res: Response) {
    var id: number;
    try {
      id = Number(req.params.id);
    } catch (err) {
      return res.status(400).json({
        message: req.t("invalid_id"),
      });
    }

    const categories = await PostCategoriesService.getById(id);
    return res.status(200).json({
      data: categories,
    });
  }

  static async updatePostCategory(req: RequestWithUser, res: Response) {
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

    if (user.role !== Role.ADMIN) {
      return res.status(403).json({
        message: req.t("auth.not_enough_access"),
      });
    }

    var id: number;
    try {
      id = Number(req.params.id);
    } catch (err) {
      return res.status(400).json({
        message: req.t("invalid_id"),
      });
    }

    const postCategory = await PostCategoriesService.getById(id);
    if (!postCategory) {
      return res.status(404).json({
        message: req.t("post_category.not_found"),
      });
    }

    try {
      const updatedPost = await PostCategoriesService.update(
        postCategory,
        data.name
      );
      return res.status(200).json({
        message: req.t("post_category.updated"),
        data: updatedPost,
      });
    } catch (err) {
      logger.error("Error updating post category: ", err);
      return res.status(500).json({
        message: req.t("post_category.internal_server_error"),
      });
    }
  }

  static async deletePostCategory(req: RequestWithUser, res: Response) {
    const authUser = req.user;

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

    var id: number;
    try {
      id = Number(req.params.id);
    } catch (err) {
      return res.status(400).json({
        message: req.t("invalid_id"),
      });
    }

    const postExists = await PostCategoriesService.existsById(id);
    if (!postExists) {
      return res.status(404).json({
        message: req.t("post_category.not_found"),
      });
    }

    await PostCategoriesService.delete(id);
    return res.status(200).json({
      message: req.t("user.deleted"),
    });
  }
}
