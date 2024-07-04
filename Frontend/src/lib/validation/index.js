import { number, z } from "zod";
export const SignUpValidation = z.object({
  username:z.string().min(3,{message:"To Short"}),
  email: z.string().min(5,{message:"To Short"}),
  password: z.string().min(8,{message:"Password must be atleast 4 character"}),
  companyId:z.string()
});
export const SignInValidation = z.object({
    email: z.string().min(5,{message:"To Short"}),
    password: z.string().min(8,{message:"Password must be atleast 4 character"})
  });
export const AddResourceValidation = z.object({
     type: z.string().min(3,{message:"To Short"}),
     description: z.string().min(5,{message:"To Short"}),
     count:z.string()
  });  
