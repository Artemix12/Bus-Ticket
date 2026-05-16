import{NextRequest,NextResponse} from 'next/server'
import { auth } from "@/utils/auth"
import{headers} from 'next/headers'
import dbConnect from '@/dbconfig/mongoose'
import bookingModel from "@/models/booking.model";
import mongoose from 'mongoose'

export async function GET(request:NextRequest)
{
   try 
   {
    await dbConnect()
    const session = await auth.api.getSession({
    headers: await headers() 
    })

    
    if(!session){
    return NextResponse.json({error:'Unauthorized'},{status:401})
    } 

    const usersBookings = await bookingModel.aggregate([
      {
        $match:
        {
          userId: new mongoose.Types.ObjectId(session.user.id)
        }
      },
      {
        $lookup:
        {
          from:"trips",
          localField:'tripId',
          foreignField:"_id",
          as:'trip'
        }
      },
      {
        $unwind:
        {
          path:'$trip',
          preserveNullAndEmptyArrays:true
        }
      },
      {
        $project:
      {
        passengerCount:1,
        seatNumber:1,
        isUsed:1,
        totalPrice:1,
        createdAt:1,

        trip:
        {
          origin: '$trip.from',
          destination: '$trip.to',
          departureDate: '$trip.departureDate',
          departureTime: '$trip.departureTime',
          price: '$trip.price'
        }

      }
      }
    ])

   if(usersBookings.length===0)
   {
     return NextResponse.json({status:204,message:'You have no reservations right now'})
   }

    return NextResponse.json({
      success:true,
      data:usersBookings,
      message: "User bookings retrieved successfully"

    },{status:200,})

    
   } catch (error) 
   {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({error:message},{status:500})
     
   }
}