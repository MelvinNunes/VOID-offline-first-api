import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { UserServices } from "../../src/domain/services/userService";
import AuthService from "../../src/domain/services/authService";
import { RegisterRequest, RequestWTranslation } from "../infrastructure/types";
import { UserDTO } from "../../src/dtos/userDTOs";
import { Role } from "@prisma/client";

const bcrypt = require("bcrypt");

export default class AuthController {
  static async login(req: RequestWTranslation, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);

    const user = await UserServices.findByEmail(data.email);
    if (!user) {
      return res.status(404).json({ message: req.t("user.not_found") });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: req.t("auth.invalid_credentials") });
    }

    const token = AuthService.generateAccessToken(data.email);

    return res
      .status(200)
      .json({ message: req.t("auth.success"), token: token });
  }

  static async register(req: RegisterRequest, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);

    const user = await UserServices.findByEmail(data.email);
    if (user) {
      return res.status(409).json({
        message: req.t("user.already_exists_with_email"),
      });
    }

    const dto: UserDTO = {
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phoneNumber: data.phone_number,
      password: data.password,
      role: Role.USER,
    };

    try {
      await UserServices.createUser(dto);
    } catch (err) {
      return res.status(500).json({
        message: req.t("internal_server_error"),
      });
    }

    const token = AuthService.generateAccessToken(data.email);

    return res
      .status(201)
      .json({ message: req.t("user.created"), token: token });
  }
}
