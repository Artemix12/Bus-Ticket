import Booking from "@/models/booking.model";
import Trip from "@/models/trip.model";
import {NextResponse,NextRequest} from "next/server";
import {auth} from "@/utils/auth";
import {headers} from "next/headers";
import dbConnect from "@/dbconfig/mongoose";
import QRCode from 'qrcode'
import {giftTicketMailgenContent, sendEmail} from "@/helper/mail";
import * as Sentry from "@sentry/nextjs";

export const POST = async(request:NextRequest,{params}:{params:Promise<{id:string}>})=>
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
    const {seatNumber,passengerCount,giftRecipient} = await request.json()
    
    if(!seatNumber || !passengerCount || !giftRecipient){
    return NextResponse.json({error:'Seat number, giftRecipient and passenger count are required'},{status:400})
    }

    const findTrip = await Trip.findById(id)
    
    if(!findTrip){
    return NextResponse.json({error:'Trip not found'},{status:404})
    }
        
    if(findTrip.status !== 'available'){
    return NextResponse.json({error:'Trip is not available for booking'},{status:400})
    }
    
    if(findTrip.remainingSeat < passengerCount){
    return NextResponse.json({error:'Not enough seats available'},{status:400})
    }else
    {
     await Trip.findByIdAndUpdate(id,{$inc:{remainingSeat:-passengerCount}},{returnDocument: 'after'})
    }

    const giftBooking  = await Booking.create({
    userId: session.user.id,
    tripId: id,
    seatNumber,
    passengerCount,
    giftRecipient:giftRecipient,
    totalPrice: findTrip.price * passengerCount,
    isGift:true
    })
    
    const ticketUrl = `${process.env.DOMAIN}/scan/${giftBooking._id}`
    
    const qrCode = await QRCode.toDataURL(ticketUrl)
       
    if(!qrCode){
    return NextResponse.json({error:'Failed to generate QR code'},{status:500})
    }
    
    await sendEmail({
    email:giftRecipient,
    qrCode,
    subject:"🎁 You've Received a Bus Ticket Gift",
    mailgenContent:giftTicketMailgenContent(
          giftRecipient,
          session.user.email,
          {
            from: findTrip.from,
            to: findTrip.to,
            departureDate: findTrip.departureDate,
            departureTime: findTrip.departureTime,
            price: findTrip.price,
          },
          giftBooking.seatNumber,
          ticketUrl
      ),

    })

  Sentry.logger.info("Gift ticket created successfully", {
  bookingId: giftBooking._id,
  senderId: session.user.id,
  tripId: id
})

    return NextResponse.json({success:true,data:giftBooking,message: "Ticket gifted successfully"},{status:201})
    
  } catch (error) 
  {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    Sentry.logger.error("Failed to create gift booking", {route: "/api/v1/bookings/[id]/gift"})
    Sentry.captureException(error,{tags:{section:"gift-booking"}})
    return NextResponse.json({error: message}, {status: 500})
  }
}