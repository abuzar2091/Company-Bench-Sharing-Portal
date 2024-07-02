import { Router } from "express";
import { addResource, createCompany, deleteResource, updateResource } from "../controllers/admin.controller.js";

const router=Router();
router.route("/createcompany").post(createCompany);
router.route("/addresource").post(addResource); 
router.route("/updateresource").post(updateResource); 
router.route("/deleteresource").post(deleteResource); 
export default router;