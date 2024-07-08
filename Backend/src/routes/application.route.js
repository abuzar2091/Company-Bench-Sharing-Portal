import { Router } from "express";
import { getCompanyDetails, getResources } from "../controllers/application.controller.js";

const router=Router();
router.route("/getCompanyDetails").get(getCompanyDetails);
router.route("/getresources/:filter").get(getResources);
export default router;