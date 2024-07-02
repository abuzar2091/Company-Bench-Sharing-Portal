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
     default:1
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
  if (this.count > 0) {
      const booking=Math.min(this.count,countToBook);
      this.bookedBy.push({ user,countToBook:booking });
    this.count -= booking;
    if(this.count==0){
        this.status="booked"
        this.availableFrom=null
    }
    await this.save();

    user.bookedResources.push({ resource: this._id,countToBook:booking });
    await user.save();
    
    return booking;
  }
  return 0;
};

resourceSchema.methods.releaseResource = async function(user,countToRelease) {
  const bookingIndex = this.bookedBy.findIndex(
    (booking) => booking.user.toString() === user._id.toString()
  );
  const isReleasedResourceDelete=0;
  if (bookingIndex !== -1) {
    this.bookedBy[bookingIndex].countToBook -= countToRelease;
    if (this.bookedBy[bookingIndex].countToBook <= 0) {
        this.bookedBy.splice(bookingIndex, 1);
      }
    this.count += countToRelease;
    if(this.count>=1){
        this.status="available"
        if(this.availableFrom===null){
            this.availableFrom=Date.now
        }
    }
    await this.save();
    const userBookingIndex = user.bookedResources.findIndex(
        (booking) => booking.resource.toString() === this._id.toString()
      );
    if (userBookingIndex !== -1) {
        user.bookedResources[userBookingIndex].countToBook -= countToRelease;
  
        if (user.bookedResources[userBookingIndex].countToBook <= 0) {
            isReleasedResourceDelete=1;
          user.bookedResources.splice(userBookingIndex, 1);
        }
        
        await user.save();
      }

    return isReleasedResourceDelete;
  }
  return 0;
};

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
