import { Request } from "express";

export type AuthUser = {
  username: string;
  iat: string;
  exp: string;
};

export class ApplicationException extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = "ApplicationException";
  }
}

export type File = {
  fieldname: string;
  originalname: string;
  enconding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export interface RequestWithUser extends Request {
  user?: AuthUser;
}

export interface RegisterRequest extends Request {
  file: File;
}
