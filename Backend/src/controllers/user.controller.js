
import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Company } from "../models/company.model.js";
import { Resource } from "../models/resource.model.js";
import { User } from "../models/user.model.js";
import { VerifyUser } from "../models/verifyuser.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import wrapAsyncHandler from "../utils/wrapAsyncHandler.js";
import axios from "axios";

const generateAccessAndRefreshToken = async (userId) => {
  try {
      const user = await User.findOne(userId);
      console.log(user);
      const accessToken = await user.generateAccessToken();
      console.log(accessToken);
      console.log("refresh");
      const refreshToken = await user.generateRefreshToken();

      console.log("re");
      console.log(refreshToken);
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false }); //To bypass the validations for token generation
      return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(400,"Something went wrong while generating access and refresh token ",error);
    
  }
  };
const registerUser = wrapAsyncHandler(async (req, res, next) => {
    //   //get the user info from frontend
    //   //perform validation--not empty
    //   //check if user already exits:username ,email
    //   // create user obj and save in db
    //   //remove password and refresh token from the respone
    //   //check for the user creation
    //   //return respone
    const { username, email, password,companyId,role} = req.body;
    console.log("body part ",req.body);
    if (
      [username, email, password,companyId].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const exitedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (exitedUser) {
      throw new ApiError(409, "User with username or email already exits");
    }
    const user = await User.create({
      username,
      email,
      password,
      companyId,
      role
    });
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      const createdUser = await User.findById(user._id).select(
        "-password  -refreshToken"
      );
    
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { createdUser },
            "User Registered Successfully"
          )
        );
  });

const loginUser = wrapAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    //const email="ali@dgmail.coma", password="12341d";
    console.log(email, password);
    if (!email) {
      throw new ApiError(400, "Email is required");
    }
    const user = await User.findOne({email 
      //$or: [{ email }],
    });
    if (!user) {
      throw new ApiError(404, "User does not exits do signup first");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid User Credentails");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
  
    const loggedInUser = await User.findOne(user._id).select(
      "-password -refreshToken"
    );
  
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, {user: loggedInUser,
            refreshToken,accessToken
         }, "User Logged In Successfully")
      );
  });
  const getCurrentUser = wrapAsyncHandler((req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200,req.user, "current User fetched Successfully"));
  });  
  
  const logoutUser = wrapAsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: { refreshToken: 1 },
        //   or
        //   $set: { refreshToken: null },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User Logged Out Successfully!"));
  });   

const bookResources =wrapAsyncHandler(async(req,res)=>{
  const {resourceId,count}=req.body;
 console.log(req.body);
  const userId=req.user?._id
    if(!resourceId){
        throw new ApiError(404,"Invalid resourceId")
    }
    console.log("res id",resourceId);
    const resource=await Resource.findById(resourceId);
    if(!resource) throw new ApiError(404,"Resource not found");
    const companyId=resource.companyId;
    const user=await User.findById(userId);
    const bookedResource=await resource.bookResource(user,count);
    if (bookedResource >= 1) {
      let booking = await Booking.findOne({ resourceId });

      if (booking) {
        // Check if the user has already booked this resource
        const userBooking = booking.bookedResources.find(
          (resource) => resource.bookedBy.toString() === userId.toString()
        );
    
        if (userBooking) {
          // User has already booked this resource, increase the count
          userBooking.countToBook +=bookedResource;
        } else {
          // User has not booked this resource yet, add a new booking entry
          booking.bookedResources.push({
            bookedBy: userId,
            countToBook: bookedResource
          });
        }
      } else {
        // Resource is being booked for the first time
        booking = await Booking.create({
          companyId:companyId, // Replace with your company ID
          resourceId: resourceId,
          bookedResources: [
            {
              bookedBy: userId,
              countToBook:bookedResource,
            },
          ],
        });
      }
    
      // Save the updated or new booking
      await booking.save();
      return res.status(200).json(new ApiResponse(200,{booking},"Resource Successfully Booked"));
    }else{
        return res.status(404).json(new ApiResponse(404,{},"Empty stock"));
    }

});
const releaseResources =wrapAsyncHandler(async(req,res)=>{
    const {resourceId,count}=req.body;
    if(!resourceId){
        throw new ApiError(404,"Invalid resourceId")
    }
    // const resourceId="6683ac1ada20ed52db6b306d";
    // const count=2;
    // const bookedBy="668397766e90ee3421f075a0"
    const bookedBy=req.user?._id;
    const resource=await Resource.findById(resourceId);
    if(!resource) throw new ApiError(404,"Resource not found");
    const user=await User.findById(bookedBy);
    const isReleasedResource=await resource.releaseResource(user,count);
        console.log("kya release hua");
    if(isReleasedResource===1){
      try {
        let booking = await Booking.findOne({ resourceId });
    
        if (!booking) {
          return res.status(200).json(new ApiResponse( 404,{}, 'Booking not found') );
        }
    
        let userBooking = booking.bookedResources.find((user) => user.bookedBy.toString() === bookedBy);
    
        if (!userBooking) {
          return res.status(200).json(new ApiResponse( 404,{}, 'User Booking not found'));
        }
    
        userBooking.countToBook -= count;
    
        if (userBooking.countToBook <= 0) {
          booking.bookedResources = booking.bookedResources.filter((user) => user.bookedBy.toString() !== bookedBy);
        }
    
        await booking.save();
        return res.status(200).json(new ApiResponse(200,{booking},"Resource Successfully Released"));
      } catch (error) {
        return res.status(200).json(new ApiResponse(200,{},{message: error.message}));
      }  
}else{
        return res.status(404).json(new ApiResponse(404,{},"Resource Successfully Released"));
    }

});



//   //get the user info from frontend
//   //perform validation--not empty
//   //check if user already exits:username ,email
//   // create user obj and save in db
//   //remove password and refresh token from the respone
//   //check for the user creation
//   //return respone
const verificationUser = wrapAsyncHandler(async (req, res, next) => {
    const {username, email, password,companyId,role} = req.body;
    console.log("body part ",req.body);
    if (
      [username, email, password,companyId].some((field) => field?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const exitedUser = await VerifyUser.findOne({
      $or: [{ username }, { email }],
    });
    if (exitedUser) {
      throw new ApiError(404,"User with username or email already exits");
    }
    const user = await VerifyUser.create({
      username,
      email,
      password,
      companyId,
      role
    });
      const createdUser = await VerifyUser.findById(user._id);
      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            { createdUser },
            "Registration request submitted. Awaiting admin approval."
          )
        );
  });
const changePassword=wrapAsyncHandler(async(req,res,next)=>{
  const {companyId}=req.body;
   const user=await User.findById(req.user?._id);
   if(!user){
    throw new ApiError(404,"User is not logged In");
   }
   user.username="Larry Page";
   user.companyId=new mongoose.Types.ObjectId(companyId)
   await user.save();
   return res.status(200).json(new ApiResponse(200, { user }, "Password change successfully"));
  
})  

const getResources=wrapAsyncHandler(async(req,res,next)=>{
  const resources=await Resource.find({status:"available"});
  if(!resources){
    return res.status(404).json(new ApiResponse(404,{},"no resouce found"))
  }
  return res.status(200).json(new ApiResponse(200,{resources},"resources fetched successfully"));
})

const getBookedResources = wrapAsyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(200).json(new ApiResponse(400, {}, "User ID is required"));
  }

  const bookedResources = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$bookedResources" },
    {
      $lookup: {
        from: "resources",
        localField: "bookedResources.resource",
        foreignField: "_id",
        as: "resourceDetails"
      }
    },
    { $unwind: "$resourceDetails" },
    {
      $project: {
        _id: 0,
        "resourceDetails._id":1,
        "resourceDetails.type": 1,
        "resourceDetails.description": 1,
        "resourceDetails.count": 1,
        "bookedResources.countToBook": 1,
        "bookedResources.bookedAt": 1
      }
    }
  ]);
  console.log(bookedResources);
  if (bookedResources?.length===0) {
    
    return res.status(200).json(new ApiResponse(404,{}, "No booked resources found"));
  }

  return res.status(200).json(new ApiResponse(200, { bookedResources }, "Booked resources fetched successfully"));
});
const sendEmailToBecomeOwner=wrapAsyncHandler(async(req,res)=>{
  const {ownerEmail}=req.body;
  console.log("in backed ",req.body);
  await axios
  .post(
    process.env.GOOGLE_SHEET_WEB_APP_URL,
    {
     ownerEmail 
    }
  )
  .then((res) => {
    console.log("result ", res.data);
  })
  .catch((err) => {
    console.log("some error occur ",err);
  });
  return res
  .status(200)
  .json(new ApiResponse(200, "Form Submitted Successfully", "Email Send!"));
})

export{
    registerUser,
    loginUser,
    bookResources,
    releaseResources,
    verificationUser,
    getCurrentUser,
    logoutUser,
    changePassword,
    getResources,
    getBookedResources,
    sendEmailToBecomeOwner
}  