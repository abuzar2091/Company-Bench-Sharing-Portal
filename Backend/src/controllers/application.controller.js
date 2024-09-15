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
  
  let resources;
  
    if (filter === "available" || filter === "booked") {
        resources = await Resource.find({ status: filter }).skip(skip).limit(limit);
      } else if (filter === "filter") {
        resources = await Resource.find({}).skip(skip).limit(limit);
      } else {
        resources = await Resource.find({ type: filter }).skip(skip).limit(limit);
      }
      
      if (!resources) {
        return res.status(404).json(new ApiResponse(404, {}, "No resource found of this category"));
      }
      
      const totalResources = await Resource.countDocuments(filter === "available" || filter === "booked" ? { status: filter } : filter === "filter" ? {} : { type: filter });
      const hasMore = page * limit < totalResources;
      
      return res.status(200).json(new ApiResponse(200, { resources, hasMore }, "Resources fetched successfully"));
    });
    
    const getCompanyDetails = wrapAsyncHandler(async (req, res) => {
      //const { page = 1, limit = 10 } = req.query; 
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      
      // Fetch companies with pagination
      const companies = await Company.find({}).skip(skip).limit(Number(limit));
      
      if (!companies || companies.length === 0) {
        return res.status(200).json(new ApiResponse(404, {}, "No Registered Company Found"));
      }
      
      return res.status(200).json(new ApiResponse(200, { companies }, "Companies Fetched Successfully"));
    });
    export {
      getResources,
      getCompanyDetails
      
    }
    