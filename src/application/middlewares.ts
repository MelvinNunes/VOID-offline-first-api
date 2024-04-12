import { Request, Response } from "express";
import {
  ApplicationException,
  AuthUser,
  RequestWithUser,
} from "../infrastructure/types";
const jwt = require("jsonwebtoken");

async function handleErrorsMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: any
) {
  if (err instanceof ApplicationException) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    console.error(`Unknown error: ${err.name}`);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
}

function authenticateToken(req: RequestWithUser, res: Response, next: any) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({
      message: "Por favor insira o token de autenticação!",
    });

  jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
    (err: any, user: AuthUser) => {
      if (err)
        return res.status(403).json({
          message: "O token inserido é invalido!!",
        });
      req.user = user;
      next();
    }
  );
}

export { authenticateToken, handleErrorsMiddleware };
