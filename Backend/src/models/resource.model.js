import mongoose from 'mongoose';
const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true,
    min:0,
    default:0
  },
  companyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Company', 
    required:true
  },
  bookedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
  availableFrom:{
    type: Date,
    default:Date.now
  },
  status:{
    type:String,
    default:"available"
  }
});

resourceSchema.methods.bookResource = async function(user,countToBook) {
    const userBookingIndex = user.bookedResources.findIndex(
        (booking) => booking.resource.toString() === this._id.toString()
      );
     
  if (this.count > 0) {
      const booking=Math.min(this.count,countToBook);
      const existingBooking = this.bookedBy.find(b => b.user.toString() === user._id.toString());
      if (existingBooking) {
        existingBooking.countToBook += booking;
      } else {
        this.bookedBy.push({ user, countToBook: booking });
      }
     
    this.count -= booking;
    if(this.count===0){
        this.status="booked"
        this.availableFrom=null
    }
    await this.save();
    const userBooking = user.bookedResources.find(b => b.resource.toString() === this._id.toString());
    if (userBooking) {
      userBooking.countToBook += booking;
    }else{
      user.bookedResources.push({ resource: this._id, countToBook: booking });
    }

    await user.save();
    
    return  booking;
  }
  return -1;
};

resourceSchema.methods.releaseResource = async function(user,countToRelease) {
  const bookingIndex = this.bookedBy.findIndex(
    (booking) => booking.user.toString() === user._id.toString()
  );
  let isReleasedResource=0;
  if (bookingIndex !== -1) {
   this.bookedBy[bookingIndex].countToBook -= countToRelease;
    if (this.bookedBy[bookingIndex].countToBook <= 0) {
        this.bookedBy.splice(bookingIndex, 1);
      }
    const num=parseInt(countToRelease);
    this.count += num;
    if(this.count>=1){
        this.status="available"
        if(this.availableFrom===null){
            this.availableFrom=Date.now()
        }
    }
    await this.save();
    const userBookingIndex = user.bookedResources.findIndex(
        (booking) => booking.resource.toString() === this._id.toString()
      );
    if (userBookingIndex !== -1) {
        user.bookedResources[userBookingIndex].countToBook -= countToRelease;
  
        if (user.bookedResources[userBookingIndex].countToBook <= 0) {
          user.bookedResources.splice(userBookingIndex, 1);
        }
        
        await user.save();
      }
      isReleasedResource=1;
    return isReleasedResource;
  }
  return isReleasedResource;
};

export const Resource = mongoose.model('Resource', resourceSchema);

