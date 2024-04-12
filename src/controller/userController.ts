import { Request, Response } from "express";
import { UserServices } from "../../src/domain/services/userService";
import { RequestWithUser } from "../../src/infrastructure/types";
import { UserVM } from "../../src/dtos/userDTOs";
import ProfileService from "../../src/domain/services/profileService";

export default class UserController {
  static async getAllUsers(req: Request, res: Response) {
    const data = await UserServices.getAllUsers();
    return res.status(200).json({
      data: data,
    });
  }

  static async getOnlineUser(req: RequestWithUser, res: Response) {
    const authUser = req.user;

    const user = await UserServices.findByEmail(authUser.name);
    if (!user) {
      return res.status(404).json({
        message: req.t("user.not_found"),
      });
    }

    const profile = await ProfileService.findByUserId(user.id);
    if (!profile) {
      return res.status(404).json({
        message: req.t("profile.not_found"),
      });
    }

    const userVM: UserVM = {
      email: user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      role: user.role,
    };

    return res.status(200).json({
      message: req.t("profile.success"),
      data: userVM,
    });
  }
}
