import { auth } from "@/utils/auth"
import {headers} from 'next/headers'
import dbConnect from '@/dbconfig/mongoose'
import{NextRequest,NextResponse} from 'next/server'
import Trip from "@/models/trip.model"
import * as Sentry from "@sentry/nextjs";



export async function POST(request:NextRequest)
{
   try 
   {
    await dbConnect()
    const session = await auth.api.getSession({
    headers: await headers() 
    })

    if(!session || session.user.role !=='admin'){
    return NextResponse.json({error:'Unauthorized'},{status:401})
    }

   const{from,to ,departureDate,departureTime,price,remainingSeat,status,totalSeat } = await request.json() 
   
   if ([from, to, departureDate, departureTime, price, remainingSeat, status, totalSeat].some((value) => value === '')) 
    {
    return NextResponse.json(
    { error: 'All fields are required. Please ensure no fields are left empty.' },
    
    { status: 400 }
    )
    }

   const date = new Date(departureDate)

   if(isNaN(date.getTime())){

    return NextResponse.json(
   { error: 'Invalid departure date. Please provide a valid date in the expected format.' },
   { status: 400 })
   }
 
   const time = new Date(departureTime)

   if(isNaN(time.getTime()))
   {
    return NextResponse.json(
    { error: 'Invalid departure time. Please provide a valid time in the expected format.' },
    { status: 400 }
    )
   }

   if(remainingSeat!==totalSeat)
  {
  return NextResponse.json(
   { error: 'Total seats must match the number of remaining seats.' },
   { status: 422 }
  )
  }

   const newTrip = await Trip.create
   ({
    from,
    to,
    departureDate,
    departureTime,
    price,
    remainingSeat,
    status,
    totalSeat
   })

  Sentry.logger.info("Trip created successfully", 
  {
  tripId: newTrip._id,
  adminId: session.user.id,
  origin: from,
  destination: to
  })

  return NextResponse.json({
  success:true,
  data:newTrip,
  message:'Trip created successfully'
},{status:201,})

} 
catch (error){
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  Sentry.logger.error("Failed to create trip", {route: "/api/v1/trip",})
  Sentry.captureException(error,{tags:{section:"trip-creation"}})
  return NextResponse.json({error: message}, {status: 500})
  }

}

export async function GET(request:NextRequest)
{
  try 
  {
    await dbConnect()
    const session = await auth.api.getSession({
    headers: await headers() 
    })

    if(!session ){
    return NextResponse.json({error:'Unauthorized'},{status:401})
    }

    const trips = await Trip.aggregate([
    {

    $project:{
    from:1,
    to:1,
    departureDate:1,
    departureTime:1,
    price:1,
    remainingSeat:1,
    status:1,
    totalSeat:1
    }
    }
    ])

    if(trips.length === 0)
    {
      return NextResponse.json({message:'No trips right now',success:true}, {status: 200})
    }

    Sentry.logger.info("Trips retrieved successfully", 
    {
    userId: session.user.id,
    tripsCount: trips.length
    })

    return NextResponse.json({
    success:true,
    data:trips,
    message: 'Trips retrieved successfully'
    },
    {
      status:200
    })

  } 
  catch (error) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  Sentry.logger.error("Failed to retrieve trips", {route: "/api/v1/trips",})
  Sentry.captureException(error,{tags:{section:"trips-list"}})
  return NextResponse.json({error: message}, {status: 500})
  }
}



