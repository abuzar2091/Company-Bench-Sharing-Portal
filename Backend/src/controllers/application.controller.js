import { Company } from "../models/company.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import wrapAsyncHandler from "../utils/wrapAsyncHandler.js";
const getCompanyDetails=wrapAsyncHandler(async(req,res)=>{
         const company=await Company.find({});
         if(!company){
            return res.status(200).json(new ApiResponse(404,{},"No Registered Company Found"));
         }
         return  res.status(200).json(new ApiResponse(200,{company},"All Company Fetched Successfully"));

})
export{
    getCompanyDetails
}