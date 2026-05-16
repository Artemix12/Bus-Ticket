import Booking from "@/models/booking.model";
import Trip from "@/models/trip.model";
import {NextResponse,NextRequest} from "next/server";
import {auth} from "@/utils/auth";
import {headers} from "next/headers";
import dbConnect from "@/dbconfig/mongoose";

export const PATCH = async(request:NextRequest,{params}:{params:Promise<{id:string}>})=>
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
    const{id}=await params
    
    if(!id){
    return NextResponse.json({error:'ID is required'},{status:400})
    }

    const findBooking = await Booking.findById(id)
        
    if(!findBooking){
    return NextResponse.json({error:'Booking not found'},{status:404})
    }
            
    if(findBooking.isUsed || findBooking.status !== 'available'){
    return NextResponse.json({error:'Booking is not available for scanning'},{status:400})
    }

    findBooking.isUsed = true
    await findBooking.save()
    return NextResponse.json({message:'Booking scanned successfully'},{status:200})
  } catch (error) 
  {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return NextResponse.json({error: message}, {status: 500})
  }
}