import Booking from "@/models/booking.model";
import Trip from "@/models/trip.model";
import {NextResponse,NextRequest} from "next/server";
import {auth} from "@/utils/auth";
import {headers} from "next/headers";
import dbConnect from "@/dbconfig/mongoose";
import QRCode from 'qrcode'
import {bookingConfirmationMailgenContent, bookingCancellationMailgenContent, sendEmail} from "@/helper/mail";
import * as Sentry from "@sentry/nextjs";



export const POST = async (request:NextRequest,{params}:{params:Promise<{id:string}>})=>{
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
    const {seatNumber,passengerCount} = await request.json()

    if(!seatNumber || !passengerCount){
    return NextResponse.json({error:'Seat number and passenger count are required'},{status:400})
    }

    const findTrip = await Trip.findById(id)

    if(!findTrip){
    return NextResponse.json({error:'Trip not found'},{status:404})
    }
    
    if(findTrip.status !== 'available'){
    return NextResponse.json({error:'Trip is not available for booking'},{status:400})
    }

    if(findTrip.remainingSeat < passengerCount){
    Sentry.logger.warn("Booking failed due to insufficient seats", {
    tripId: id,
    requestedSeats: passengerCount,
    remainingSeats: findTrip.remainingSeat})
    return NextResponse.json({error:'Not enough seats available'},{status:400})

    }else
    {
      await Trip.findByIdAndUpdate(id,{$inc:{remainingSeat:-passengerCount}},{returnDocument: 'after'})
    }


    const newBooking = await Booking.create({
      userId: session.user.id,
      tripId: id,
      seatNumber,
      passengerCount,
      totalPrice: findTrip.price * passengerCount
    })

    const ticketUrl = `${process.env.DOMAIN}/scan/${newBooking._id}`

    const viewAllTicketsURL = `${process.env.DOMAIN}/dashboard`

    const qrCode = await QRCode.toDataURL(ticketUrl)
   
    if(!qrCode){
    return NextResponse.json({error:'Failed to generate QR code'},{status:500})
    }

  try {
    await sendEmail({
      email: session.user.email,
      subject: "Booking Confirmation",
      qrCode,
      mailgenContent: bookingConfirmationMailgenContent(
        session.user.name,
        {
          origin: findTrip.from,
          destination: findTrip.to,
          departureDate: findTrip.departureDate,
          departureTime: findTrip.departureTime,
          price: findTrip.price,
        },
        newBooking.seatNumber,
        newBooking.totalPrice,
        newBooking.passengerCount,
        viewAllTicketsURL
      )
    });
  
  } catch (error) {
    Sentry.logger.error("Failed to send Email confirmation")
    Sentry.captureException(error, {tags: {section: "email-confirmation"}});
  }


  Sentry.logger.info("Booking created successfully", {
  bookingId: newBooking._id,
  userId: session.user.id,
  tripId: id,
  passengerCount,
  totalPrice: newBooking.totalPrice
  })

  return NextResponse.json({success:true,data:newBooking,message: "Booking created successfully"},{status:201})

  } 
  catch (error) 
  {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    Sentry.logger.error("Failed to create booking", {route: "/api/v1/bookings/[id]",})
    Sentry.captureException(error,{tags: {section: "booking-creation"}})
    return NextResponse.json({error: message}, {status: 500})
   }
}

export const DELETE = async(request:NextRequest,{params}:{params:Promise<{id:string}>})=>
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
   
   const existingBooking = await Booking.findById(id)

   if (!existingBooking) {
   return NextResponse.json(
    { error: 'Booking not found' },
    { status: 404 }
   )
   }

  const updatedBooking = await Booking.findByIdAndDelete(
  id,
  
  )

  const updatedRemainingSeats = await Trip.findByIdAndUpdate(
    updatedBooking.tripId,
    {
    $inc:
    {
        remainingSeat:updatedBooking.passengerCount
    }
    },
    {returnDocument:'after'}
    )

    if (!updatedRemainingSeats) {
    return NextResponse.json(
    { error: 'Trip not found or seats could not be updated' },
    { status: 404 }
   )
  }

    try {
      await sendEmail({
        email: session.user.email,
        subject: "Booking cancellation",
        mailgenContent:bookingCancellationMailgenContent(
          session.user.name,
          {
            from:updatedRemainingSeats.from,
            to:updatedRemainingSeats.to,
            departureDate:updatedRemainingSeats.departureDate,
            price:updatedRemainingSeats.price
          }
        )
      });
      
    } catch (error) {
      Sentry.logger.error("⚠️ Failed to send cancellation email")
      Sentry.captureException(error, {tags: {section: "email-cancellation"}});
    }

  Sentry.logger.info("Booking cancelled successfully", 
  {
  bookingId: id,
  userId: session.user.id,
  restoredSeats: updatedBooking.passengerCount
  })

  return NextResponse.json({ message: 'Booking cancelled successfully' },{ status: 200 })


 } catch (error) 
 {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
  Sentry.logger.error("Failed to cancel booking", {route: "/api/v1/bookings/[id]",})
  Sentry.captureException(error,{tags: {section: "booking-cancellation"}})
  return NextResponse.json({error: message}, {status: 500})
 }
}


