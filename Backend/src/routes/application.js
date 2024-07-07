import { Router } from "express";
import { getCompanyDetails } from "../controllers/application.controller.js";

const router=Router();
router.route("/getCompanyDetails").get(getCompanyDetails);
export default router;