import { Router } from "express";
import { bookResources, changePassword, getBookedResources, getCurrentUser, getResources, loginUser,  logoutUser,  releaseResources, sendEmailToBecomeOwner, verificationUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/signup").post(verificationUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/get-current-user").get(verifyJWT,getCurrentUser)
router.route("/bookresources").post(verifyJWT,bookResources);
router.route("/releaseresources").post(verifyJWT,releaseResources);
router.route("/password-change").post(verifyJWT,changePassword);
router.route("/getresources").get(getResources);
router.route("/getbookedresources").get(verifyJWT,getBookedResources);
router.route("/sendEmailToBecomeOwner").post(verifyJWT,sendEmailToBecomeOwner);
export default router;