import { Company } from "../models/company.model.js";
import { Resource } from "../models/resource.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import wrapAsyncHandler from "../utils/wrapAsyncHandler.js";


const getResources = wrapAsyncHandler(async (req, res, next) => {
  const { filter } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;
  console.log("page ",page,"limit ",limit,"skip ",skip);
  // const resource = await Resource.find({});
  const resource = await Resource.find({}).skip(skip).limit(limit);
  if(!resource){
    return res.status(200).json(new ApiResponse(200, {}, "Resources nhi fetched successfully"));
  }
  const totalResources = await Resource.countDocuments();
  const hasMore = page * limit < totalResources;
  return res.status(200).json(new ApiResponse(200, { resource,hasMore}, "Resources fetched successfully"));
    });
    
    const getCompanyDetails = wrapAsyncHandler(async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      
      // Fetch companies with pagination
      const companies = await Company.find({}).skip(skip).limit(Number(limit));
      
      if (!companies || companies.length === 0) {
        return res.status(200).json(new ApiResponse(404, {}, "No Registered Company Found"));
      }
      const totalResources = await Resource.countDocuments();
      const hasMore = page * limit < totalResources;
      return res.status(200).json(new ApiResponse(200, { companies,hasMore }, "Companies Fetched Successfully"));
    });
    export {
      getResources,
      getCompanyDetails
      
    }
    