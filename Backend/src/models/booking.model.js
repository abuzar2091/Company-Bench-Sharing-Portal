import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
    resourceId :{
        type:mongoose.Schema.Types.ObjectId,
       ref:'Resource',
       required:true 
    },
    bookedBy:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'User',
     required:true  
    },
    companyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company',
        required:true
    },
    bookFrom:{
        type:Date,
        default:Date.now
    },
    countToBook:{
        type:Number,
        default:1
    },
    status:{
        type:String,
        default:"booked"
    }
});
export const Booking=mongoose.model("Booking",bookingSchema);

