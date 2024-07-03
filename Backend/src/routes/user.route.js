import { Router } from "express";
import { bookResources, loginUser,  releaseResources, verificationUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/signup").post(verificationUser);
router.route("/login").post(loginUser);
router.route("/bookresources").post(verifyJWT,bookResources);
router.route("/releaseresources").post(verifyJWT,releaseResources);
 
export default router;