import express from "express";
import HealthController from "../../src/controller/healthController";
import UserController from "../../src/controller/userController";
import path from "path";
import { isDocument } from "../../src/infrastructure/utils/validators";
import { checkSchema } from "express-validator";
import {
  loginValidator,
  registerValidator,
} from "../infrastructure/validators/authValidators";
import AuthController from "../../src/controller/authController";
const router = express.Router();
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/users/documents");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadRegister = multer({
  storage: storage,
  fileFilter: function (_req: any, file: any, cb: any) {
    isDocument(file, cb);
  },
});

router.get("/health", HealthController.checkApiHealth);

router.post("/login", checkSchema(loginValidator), AuthController.login);
router.post(
  "/register",
  uploadRegister.single("identificationFile"),
  checkSchema(registerValidator),
  AuthController.register
);

router.get("/users", UserController.getAllUsers);

module.exports = router;
