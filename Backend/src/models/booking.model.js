import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
      },
    bookedResources: [
        {  
         bookedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true  
         },
          countToBook:{
            type:Number,
            default:1
          },   
        bookFrom:{
        type:Date,
        default:Date.now
          },
          }
      ],
});
export const Booking=mongoose.model("Booking",bookingSchema);

