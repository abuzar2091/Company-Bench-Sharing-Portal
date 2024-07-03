import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
const verifyUserSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
        unique:true,
        index: true,
        trim: true,
      },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    requestedAt:{
        type:Date,
        default:Date.now
    },
    companyId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
         required:true  
       },
       role:{
        type:String,
        default:"company"
       },
    password: { type: String,trim: true, required: [true, "Password is required"] },
   
  },
  { timestamps: true }
);
verifyUserSchema.pre(
    "save",
    async function (next) {
      if (!this.isModified("password")) return next();
      this.password =await bcrypt.hash(this.password, 10);
      next();
    }
  );
verifyUserSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
  };  
export const VerifyUser=mongoose.model("VerifyUser",verifyUserSchema);