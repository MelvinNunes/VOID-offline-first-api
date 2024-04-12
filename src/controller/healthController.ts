import { Request, Response } from "express";

export default class HealthController {
  static async checkApiHealth(req: Request, res: Response): Promise<void> {
    res.json({
      message: "API is health!.",
    });
  }
}
