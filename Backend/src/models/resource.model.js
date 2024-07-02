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

resourceSchema.methods.bookResource = async function(user) {
  if (this.count > 0) {
    this.bookedBy.push({ user });
    this.count -= 1;
    if(this.count==0){
        this.status="booked"
        this.availableFrom=null
    }
    await this.save();

    user.bookedResources.push({ resource: this._id });
    await user.save();
    
    return true;
  }
  return false;
};

resourceSchema.methods.releaseResource = async function(user) {
  const bookingIndex = this.bookedBy.findIndex(
    (booking) => booking.user.toString() === user._id.toString()
  );
  if (bookingIndex !== -1) {
    this.bookBy.splice(bookingIndex, 1);
    this.count += 1;
    if(this.count>=1){
        this.status="available"
        this.availableFrom=Date.now
    }
    await this.save();

    const userBookingIndex = user.bookedResources.findIndex(
      (booking) => booking.resource.toString() === this._id.toString()
    );
    if (userBookingIndex !== -1) {
      user.bookedResources.splice(userBookingIndex, 1);
      await user.save();
    }

    return true;
  }
  return false;
};

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
