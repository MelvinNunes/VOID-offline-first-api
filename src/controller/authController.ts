import { Request, Response } from "express";
import { validationResult, matchedData } from "express-validator";
import { UserServices } from "../../src/domain/services/userService";
import AuthService from "../../src/domain/services/authService";
import { RegisterRequest } from "../infrastructure/types";
const bcrypt = require("bcrypt");

export default class AuthController {
  static async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const data = matchedData(req);

    const user = await UserServices.findByEmail(data.email);
    if (!user) {
      return res.status(401).json({ message: "User doesnt exist!" });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect credentials!" });
    }

    const token = AuthService.generateAccessToken(data.email);

    return res
      .status(200)
      .json({ message: "Login efectuado com sucesso!", token: token });
  }

  static async register(req: RegisterRequest, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(422).json({ errors: "Invalid document inserted" });
    }

    const data = matchedData(req);

    console.log("file name: " + req.file.originalname);
    console.log("file path: " + req.file.path);
    console.log("file mime: " + req.file.mimetype);
  }
}
