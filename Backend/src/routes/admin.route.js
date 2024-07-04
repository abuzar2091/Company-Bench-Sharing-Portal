import { Router } from "express";
import { addResource, createCompany, deleteResource, updateResource, toVerifyEmployee, getUnverifiedUser, getAddedResource } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router=Router();
router.route("/createcompany").post(createCompany);
router.route("/addresource").post(verifyJWT,verifyAdmin,addResource); 
router.route("/updateresource/:id").post(verifyJWT,verifyAdmin,updateResource); 
router.route("/deleteresource").post(verifyJWT,verifyAdmin,deleteResource); 
router.route("/verifyemployee").post(verifyJWT,verifyAdmin,toVerifyEmployee);
router.route("/getunverifieduser").get(verifyJWT,verifyAdmin,getUnverifiedUser);
router.route("/getaddedresource").get(verifyJWT,verifyAdmin,getAddedResource);
export default router;