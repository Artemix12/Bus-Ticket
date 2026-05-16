import mongoose from 'mongoose'

const TripSchema = new mongoose.Schema({
 
  from:
  {
    type:String,
    required:true
  },

  to:
  {
    type:String,
    required:true
  },
  departureDate:
  {
    type:Date,
    required:true
  },
  departureTime:
  {
    type:Date,
    required:true
  },
  price:
  {
    type:Number
  },
  remainingSeat:
  {
    type:Number
  },
  status:
  {
    type:String,
    enum:['available','cancelled']

  },

  totalSeat:
  {
    type:Number,
   
  },

},{
 timestamps:true

})

export default mongoose.models.Trip || mongoose.model('Trip',TripSchema)