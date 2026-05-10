import mongoose,{Schema} from 'mongoose'

const BookingSchema = new mongoose.Schema({

    passengerCount:
    {
      type:Number,
      required:true
    },

    userId:
    {
      type:Schema.Types.ObjectId,
      ref:'User'
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
      enum:['available','canceled']
    }
})

export default mongoose.models.BookingSchema || mongoose.model('Booking',BookingSchema)