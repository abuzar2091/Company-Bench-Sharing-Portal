import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import {Resource} from "../models/resource.model.js";
import { User } from "../models/user.model.js";
import { VerifyUser } from "../models/verifyuser.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import wrapAsyncHandler from "../utils/wrapAsyncHandler.js";
import { Booking } from "../models/booking.model.js";

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

const updateCompanyDetails=wrapAsyncHandler(async(req,res,next)=>{
  const {companyName,companyId,description,location}=req.body;
  if(!companyId){
    throw new ApiError(400, "Company ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, "Invalid company Id");
  }
 
  const updateCompanyInfo=await Company.findByIdAndUpdate(
      companyId,
      {
        companyName,
        description,
        location,
      },
      { new: true, runValidators: true }
);

if (!updateCompanyInfo) {
  throw new ApiError(404, "company not found");
}
console.log("info updated ",updateCompanyInfo);

return res.status(200).json(new ApiResponse(200, {updateCompanyInfo}, "Company Info Updated Successfully"));
});

const addResource=wrapAsyncHandler(async(req,res,next)=>{

    const {type,description,count}=req.body;
    if (
        [type,description].some((field) => field?.trim() === "")
      ) {
        throw new ApiError(400, "All fields are required");
      }
    const admin=await User.findById(req.user?._id);
    if(!admin){
      return res.status(404).json(new ApiResponse(404,{},"Resource cannot be added. Admin not logged in."))
    }
    console.log("admin company ",admin);
    const resource=await Resource.create({
        type,
        description,
        count,
        companyId:new mongoose.Types.ObjectId(admin.companyId)
    })
    console.log(resource);
    return res.status(201).json(new ApiResponse(201,{
        resource
    },
         "Resource added successfully"))
})

  const updateResource = wrapAsyncHandler(async (req, res) => {
    const { type, description, count } = req.body;
    const { id: resourceId } = req.params; // Ensure correct destructuring
    console.log("req body ", req.body);
  
    if (!resourceId) {
      throw new ApiError(400, "Resource ID is required");
    }
  
    // const countAsNumber = parseInt(count);
    // if (isNaN(countAsNumber)) {
    //   throw new ApiError(400, "Count must be a valid number");
    // }
  
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new ApiError(400, "Invalid Resource ID");
    }
  
    const updatedResource = await Resource.findByIdAndUpdate(
      resourceId,
      {
        type,
        description,
        count,
      },
      { new: true, runValidators: true }
    );
  
    if (!updatedResource) {
      throw new ApiError(404, "resource not found");
    }
  
    return res.status(200).json(new ApiResponse(200, { updatedResource }, "Resource Updated Successfully"));
  });


const deleteResource = wrapAsyncHandler(async (req, res) => {
    const { id:resourceId } = req.params;
    if (!resourceId) {
      throw new ApiError(400, "resource ID is required");
    }
    if (!mongoose.Types.ObjectId.isValid(resourceId)) {
      throw new ApiError(400, "Invalid Resource ID");
    }
  
    // Find the resource to be deleted

    const resource = await Resource.findById(resourceId);
    if (!resource) {
      throw new ApiError(404, "resource not found");
    }
  
    // Find all users who have booked this resource
    const users = await User.find({ 'bookedResources.resource': resourceId });
  
    // Remove the resource from each user's bookedResources
    for (const user of users) {
      user.bookedResources = user.bookedResources.filter(
        booking => booking.resource.toString() !== resourceId
      );
      await user.save();
    }
  
    // Delete all bookings associated with this resource
    await Booking.deleteMany({ resourceId });
  
    // Delete the resource
    const deletedResource = await Resource.findByIdAndDelete(resourceId);
  
    return res.status(200).json(new ApiResponse(200, { deletedResource }, "Resource deleted successfully"));
  });

const toVerifyEmployee = wrapAsyncHandler(async (req, res, next) => {
    const {employeeId, companyId } = req.body;
    console.log("companyId ", req.user?.companyId);
    const company=await Company.findOne({
        adminId:new mongoose.Types.ObjectId( req.user?._id)
    })
    

    const pendingUser = await VerifyUser.findById(employeeId);
    if (!pendingUser) {
      return res.status(404).json(new ApiResponse(404, {}, "Pending user not found"));
    }
    if(!company){
      return res.status(404).json(new ApiResponse(404, {}, "User company not found"));

    }
    
    console.log("Pending User: ", pendingUser);
  
   // console.log("Company Token: ", req.company);
  
    if (companyId.toString() === company?._id.toString()) {
      const newUser = new User({
        username: pendingUser.username,
        email: pendingUser.email,
        password: pendingUser.password,  
        role: pendingUser.role,
        companyId,
      });
  
      try {
        await newUser.save();
       await VerifyUser.findByIdAndDelete(employeeId);
  
        return res.status(200).json(
          new ApiResponse(200, { newUser }, "Verification Successfully Done")
        );
      } catch (error) {
        console.error("Error saving new user: ", error);
        return res.status(500).json(new ApiResponse(500, {}, "Internal Server Error"));
      }
    } else {
      await VerifyUser.findByIdAndDelete(employeeId);
      return res.status(200).json(
        new ApiResponse(200, {}, "Verification Rejected")
      );
    }
  });

const getUnverifiedUser=wrapAsyncHandler(async(req,res)=>{
  const unverifiedUser=await VerifyUser.find({});
  console.log(unverifiedUser);
  if(!unverifiedUser){
    return res.status(201).json(new  ApiResponse(201,{},"No New Request"));
  }
  return res.status(201).json(new  ApiResponse(201,unverifiedUser,"all unverified user fetched successfully"));
})

const getAddedResource=wrapAsyncHandler(async(req,res)=>{
  const admin=await User.findById(req.user?._id);
  if(!admin){
    return res.status(404).json(new ApiResponse(404,{},"Resource cannot be retrived. Admin not logged in."))
  }
  const resource=await Resource.find({companyId:new mongoose.Types.ObjectId(admin.companyId)});

  if(!resource){
    return res.status(404).json(new ApiResponse(404,{},"Resource not found"))
  }
  return res.status(200).json(new ApiResponse(200,{resource},"Resource fetched successfully"));

})

const getBookedResourceByOthers=wrapAsyncHandler(async(req,res,)=>{
  const user=await User.findById(req.user?._id);
  const bookedResources = await Booking.aggregate([
    {
      $match: {
        companyId: new mongoose.Types.ObjectId(user.companyId),
      },
    },
    {
      $lookup: {
        from: 'resources',
        localField: 'resourceId',
        foreignField: '_id',
        as: 'resourceDetails',
      },
    },
    {
      $unwind: '$resourceDetails',
    },
    {
      $unwind: '$bookedResources',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'bookedResources.bookedBy',
        foreignField: '_id',
        as: 'bookedByUser',
      },
    },
    {
      $unwind: '$bookedByUser',
    },
    {
      $group: {
        _id: '$_id',
        companyId: { $first: '$companyId' },
        resourceId: { $first: '$resourceId' },
        resourceDetails: { $first: '$resourceDetails' },
        bookedResources: {
          $push: {
            bookedBy: '$bookedByUser',
            countToBook: '$bookedResources.countToBook',
            bookFrom: '$bookedResources.bookFrom',
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        // companyId: 1,
        resourceId: 1,
        resourceDetails: {
          _id: 1,
          type: 1,
          description: 1,
          count: 1,
        },
        bookedResources: 1,
      },
    },
  ]);

  if (!bookedResources.length) {
    return res.status(404).json(new ApiResponse(404, {}, "No booked resources found"));
  }

  return res.status(200).json(new ApiResponse(200, { bookedResources }, "Booked resources fetched successfully"));


});
  
export{
    addResource,
    createCompany,
    updateResource,
    deleteResource,
    toVerifyEmployee,
    getUnverifiedUser,
    getAddedResource,
    getBookedResourceByOthers,
    updateCompanyDetails
}