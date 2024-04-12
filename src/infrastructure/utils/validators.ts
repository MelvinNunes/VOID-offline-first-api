import path from "path";
import { File } from "../types";

export function isImage(file: File, cb: any) {
  var extension = path.extname(file.originalname).toLowerCase();

  if (file.mimetype !== "image/png") {
    return cb(null, false);
  }

  switch (extension) {
    case ".jpg":
      return cb(null, true);
    case ".jpeg":
      return cb(null, true);
    case ".png":
      return cb(null, true);
    default:
      return cb(null, false);
  }
}

export function isDocument(file: File, cb: any) {
  var extension = path.extname(file.originalname).toLowerCase();

  if (file.mimetype !== "application/pdf") {
    return cb(null, false);
  }

  switch (extension) {
    case ".pdf":
      return cb(null, true);
    case ".docx":
      return cb(null, true);
    case ".doc":
      return cb(null, true);
    default:
      return cb(null, false);
  }
}
