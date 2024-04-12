import express from "express";
import HealthController from "../../src/controller/healthController";
import UserController from "../../src/controller/userController";
import path from "path";
import { isImage } from "../../src/infrastructure/utils/validators";
import { checkSchema } from "express-validator";
import {
  loginValidator,
  registerValidator,
} from "../infrastructure/validators/authValidators";
import AuthController from "../../src/controller/authController";
import { authenticateToken } from "./middlewares";
import PostCategoryController from "../../src/controller/postCategoryController";
import { createPostCategoryValidator } from "../../src/infrastructure/validators/postCategoriesValidators";
import PostController from "../../src/controller/postController";
import {
  postCreationValidator,
  postImageValidator,
  postUpdateValidator,
} from "../../src/infrastructure/validators/postValidators";

const router = express.Router();
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const uploadPath = "./uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  fileFilter: function (_req: any, file: any, cb: any) {
    isImage(file, cb);
  },
});

router.get("/health", HealthController.checkApiHealth);
router.post("/login", checkSchema(loginValidator), AuthController.login);
router.post(
  "/register",
  checkSchema(registerValidator),
  AuthController.register
);

router.get("/me", authenticateToken, UserController.getOnlineUser);
router.get("/users", authenticateToken, UserController.getAllUsers);
router.get(
  "/users/:id/posts",
  authenticateToken,
  PostController.getPostsFromSpecificUser
);

router.post(
  "/categories",
  authenticateToken,
  checkSchema(createPostCategoryValidator),
  PostCategoryController.createPostCategory
);

router.get(
  "/categories",
  authenticateToken,
  PostCategoryController.getAllPostCategories
);

router.get(
  "/categories/:id",
  authenticateToken,
  PostCategoryController.getPostCategoryById
);

router.put(
  "/categories/:id",
  authenticateToken,
  checkSchema(createPostCategoryValidator),
  PostCategoryController.updatePostCategory
);

router.delete(
  "/categories/:id",
  authenticateToken,
  PostCategoryController.deletePostCategory
);

router.post(
  "/posts/:id/images",
  authenticateToken,
  upload.single("file"),
  checkSchema(postImageValidator),
  PostController.uploadImageToPost
);

router.post(
  "/posts",
  authenticateToken,
  checkSchema(postCreationValidator),
  PostController.createPost
);
router.put(
  "/posts/:id",
  checkSchema(postUpdateValidator),
  authenticateToken,
  PostController.updatePostById
);
router.get("/posts", authenticateToken, PostController.getAllPosts);
router.get("/posts/:id", authenticateToken, PostController.getPostDetailsById);
router.delete("/posts/:id", authenticateToken, PostController.deletePostById);

module.exports = router;
