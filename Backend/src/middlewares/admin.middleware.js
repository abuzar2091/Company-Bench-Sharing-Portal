import { ApiError } from "../utils/ApiError.js";
import wrapAsyncHandler from "../utils/wrapAsyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyAdmin = wrapAsyncHandler(async (req,res, next) => {
  try {
     const adminId=req.user?._id;
     const admin = await User.findById(adminId);
     if(admin.role==="admin"){
        next();
     }else{
        throw new ApiError(403,"You are not authorized to perform this action. You are not the Admin");
     }
  } catch (error) {
    throw new ApiError(404, error?.message || "You are not authorized to perform this action.");
  }
});


