import { Request, Response } from "express";

export default class HealthController {
  static async checkApiHealth(req: any, res: Response) {
    return res.json({
      message: req.t("health"),
    });
  }
}
