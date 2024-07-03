import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema(
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
    role:{
        type:String,
        enum:["company","admin"],
        default:"company"
    },
    bookedResources: [
        {
          resource: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resource',
            required: true
          },
          countToBook:{
            type:Number,
            default:1
          },
          bookedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
    companyId:{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
       // required:true  
       },
    password: { type: String,trim: true, required: [true, "Password is required"] },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre(
  "save",
  async function (next) {
    const isPasswordHashed = this.password.startsWith("$2b$");
    if (!this.isModified("password") || isPasswordHashed) return next();
    this.password =await bcrypt.hash(this.password, 10);
    next();
  }
);
userSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function () {
 return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
  }
  );
};
userSchema.methods.generateRefreshToken = async function () {
   return jwt.sign({
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  
    );
};  
export const User = mongoose.model("User", userSchema);
