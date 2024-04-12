import { Response } from "express";
import { RequestWithUser } from "../../src/infrastructure/types";
import { matchedData, validationResult } from "express-validator";
import PostCategoriesService from "../../src/domain/services/postCategoryService";
import { UserServices } from "../../src/domain/services/userService";
import { Role } from "@prisma/client";

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
        message: "Post category already exists!",
      });
    }

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    if (user.role !== Role.ADMIN) {
      return res.status(403).json({
        message: "Only admins can create post categories!",
      });
    }

    try {
      await PostCategoriesService.create(data.name, user.id);
    } catch (err) {
      return res.status(500).json({
        message: "Error saving post category!",
      });
    }

    return res.status(201).json({
      message: "Post category was created successfully!",
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
        message: "Invalid id!",
      });
    }

    const categories = await PostCategoriesService.getById(id);
    return res.status(200).json({
      data: categories,
    });
  }
}
