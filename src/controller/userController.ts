import { Request, Response } from "express";
import { UserServices } from "../../src/domain/services/userService";

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const data = await UserServices.getAllUsers();
    return res.status(200).json({
      data: data,
    });
  }
}
