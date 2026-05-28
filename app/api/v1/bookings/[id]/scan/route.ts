import Booking from "@/models/booking.model";
import {NextResponse,NextRequest} from "next/server";
import dbConnect from "@/dbconfig/mongoose";
import * as Sentry from "@sentry/nextjs";

export const PATCH = async(request:NextRequest,{params}:{params:Promise<{id:string}>})=>
{
  try 
  {
    await dbConnect()
    
    const{id}=await params
    
    if(!id){
    return NextResponse.json({error:'ID is required'},{status:400})
    }

    const findBooking = await Booking.findById(id)
        
    if(!findBooking){
    return NextResponse.json({error:'Booking not found'},{status:404})
    }
            
    if(findBooking.isUsed ){
    Sentry.logger.warn("Attempt to scan already used ticket", {bookingId: id})

    return NextResponse.json({error:'Booking is already scanned'},{status:400})
    }

    if(findBooking.status !== 'available'){
      return NextResponse.json({error:'Booking is not available for scanning'},{status:400})
    }

    findBooking.isUsed = true
    await findBooking.save()

    Sentry.logger.info("Ticket scanned successfully", {bookingId: id})

    return NextResponse.json({message:'Booking scanned successfully'},{status:200})
  } 
  catch (error) 
  {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    Sentry.captureException(error,{tags:{section:"ticket-scan"}})
    Sentry.logger.error("Failed to scan ticket", {route: "/api/v1/bookings/[id]/scan"})
    return NextResponse.json({error: message}, {status: 500})
  }
}