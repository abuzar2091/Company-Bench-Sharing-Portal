import { Router } from "express";
import { addResource, createCompany } from "../controllers/admin.controller.js";

const router=Router();
router.route("/createcompany").post(createCompany);
router.route("/addresource").post(addResource); 
export default router;