import express from "express";
import userController from "../../controllers/auth-controller.js";
import { authenticate, isEmptyBody } from "../../middlewares/index.js";
import { validateBody } from "../../decorators/index.js";
import { userSignupSchema, userSigninSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  userController.signup
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(userSigninSchema),
  userController.signin
);

authRouter.get("/current", authenticate, userController.getCurrent);

authRouter.post("/logout",authenticate, userController.logout)

export default authRouter;
