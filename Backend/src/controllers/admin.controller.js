import { Company } from "../models/company.model.js";
import Resource from "../models/resource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import wrapAsyncHandler from "../utils/wrapAsyncHandler.js";

const createCompany=wrapAsyncHandler(async(req,res,next)=>{
    const {companyName,adminId,description,location}=req.body;
    if (
        [companyName,adminId,description,location].some((field) => field?.trim() === "")
      ) {
        throw new ApiError(400, "All fields are required");
      }
      const exitedCompany = await Company.findOne(
       { companyName }
      );
      if (exitedCompany) {
        throw new ApiError(409, `Company with ${companyName} already exits`);
      }
      const company=await Company.create({
        companyName,adminId,description,location
      });
      return res.status(201).json(new ApiResponse(201,{company},"Company created successfully"));

})
const addResource=wrapAsyncHandler(async(req,res,next)=>{

    const {type,description,count,companyId}=req.body;
    if (
        [type,description,companyId].some((field) => field?.trim() === "")
      ) {
        throw new ApiError(400, "All fields are required");
      }
    const resource=await Resource.create({
        type,
        description,
        count,
        companyId
    })
    return res.status(201).json(new ApiResponse(201,{
        resource
    },
         "Resource added successfully"))
})

const updateResource=wrapAsyncHandler(async(req,res)=>{
    const {resourceId,type,description,count}=req.body;
    console.log(req.body);
    if (!resourceId) {
        throw new ApiError(400, "Resource ID is required");
      }
      const updateFields = {};
      if (type) updateFields.type = type;
      if (description) updateFields.description = description;
      if (count !== undefined) updateFields.count = count;
    const updatedResource=await Resource.findByIdAndUpdate(resourceId,
        updateFields,
        { new: true, runValidators: true }
        
    )
    return res.status(200).json(new ApiResponse(200,{updatedResource},"Resource Updated Successfully"));
})
const deleteResource=wrapAsyncHandler(async(req,res)=>{
    const {resourceId}=req.body;
    if (!resourceId) {
        throw new ApiError(400, "Resource ID is required");
      }
      
    const deletedResource=await Resource.findByIdAndDelete(resourceId)
    return res.status(200).json(new ApiResponse(200,{deletedResource},"Resource deleted Successfully"));
})
export{
    addResource,
    createCompany,
    updateResource,
    deleteResource  
}