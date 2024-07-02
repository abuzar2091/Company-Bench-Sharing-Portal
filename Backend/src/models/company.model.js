import mongoose from 'mongoose';
const companySchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    adminId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'User',
     required:true  
    },
    description:{
        type:String,
        required:true,
    },
    logo:{
        type:String,
    },
    location:{
        type:String,
        required:true
    },
    resource:[
       { type:mongoose.Schema.Types.ObjectId,
        ref:"Resource"}
    ]
});
export const Company=mongoose.model("Company",companySchema);

