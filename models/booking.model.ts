import mongoose,{Schema} from 'mongoose'
import '@/models/user.model'

const BookingSchema = new mongoose.Schema({

    passengerCount:
    {
      type:Number,
      required:true
    },

    userId:
    {
      type:Schema.Types.ObjectId,
      ref:'User',
      required:true
    },

    tripId: 
    {
    type: Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
    },

    seatNumber:
    {
      type:Number,
      required:true
    },

    isUsed:
    {
      type:Boolean,
      default:false

    },

    status:
    {
      type:String,
      enum:['available','canceled'],
      default:'available'
    },
    giftRecipient:
    {
      type:String,
      default:null
    },
    isGift:
    {
      type:Boolean,
      default:false
    },
    totalPrice:
    {
      type:Number,
     
    },
  

},
{
timestamps:true
})

export default mongoose.models.Booking || mongoose.model('Booking',BookingSchema)