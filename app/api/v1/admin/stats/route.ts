import {NextRequest,NextResponse} from 'next/server'
import { auth } from "@/utils/auth"
import dbConnect from '@/dbconfig/mongoose'
import Trip from "@/models/trip.model"
import bookingModel from '@/models/booking.model'
import {headers} from 'next/headers'
import * as Sentry from "@sentry/nextjs";




export async function  GET(request:NextRequest)
{
  try {

    await dbConnect()
  const session = await auth.api.getSession({
    headers: await headers() 
    })

    if(!session || session.user.role !=='admin' ){
    Sentry.logger.warn("Unauthorized access attempt",{route: "/api/admin/dashboard"})
    return NextResponse.json({error:'Unauthorized'},{status:401})
    } 

  const data = await auth.api.listUsers({
	  query: { limit: 100 },
  	headers: await headers()
    })

  const totalTrips = await Trip.countDocuments()
  const totalBookings = await bookingModel.countDocuments()
  const totalUsers =  data.total
  const activeTrips = await Trip.countDocuments({'status':'available'})
  const cancelledTrips = await Trip.countDocuments({'status':'cancelled'})
  const totalRevenue = await Trip.aggregate([
  {
      $group:{
        _id:null,
        totalRevenue:{$sum:'$price'}

      }
  },
  {
      $project:
      {
        _id:0,
      }
  }
  ])
    
  const revenue = totalRevenue[0]?.totalRevenue || 0

  const usersWithBookings = await bookingModel.aggregate([
  {
    $lookup: {
      from: 'user',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },

  {
    $lookup: {
      from: 'trips',
      localField: 'tripId',
      foreignField: '_id',
      as: 'trip'
    }
  },

  {
    $unwind: {
      path: '$user',
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $unwind: {
      path: '$trip',
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $project: {
    _id: 1,

    passengerCount: 1,
    seatNumber: 1,
    totalPrice: 1,
    status: 1,

    passengerName: '$user.name',
    passengerEmail: '$user.email',

    origin: '$trip.from',
    destination: '$trip.to',

    departureDate: '$trip.departureDate',
    departureTime: '$trip.departureTime',

    tripPrice: '$trip.price'
    }
  }
])

     
 Sentry.logger.info("Admin dashboard retrieved successfully", {
  adminId: session.user.id,
  totalTrips,
  totalBookings,
  totalUsers
})
 
  return NextResponse.json({
  success:true,
    
  data:{
    totalTrips,
    totalBookings,
    totalUsers,
    activeTrips,
    cancelledTrips,
    revenue: revenue,
    allBookings: usersWithBookings
    
    },
  },
  {status:200}
  )

    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    Sentry.logger.error("Failed to retrieve admin dashboard", {route: "/api/v1/admin/stats"})
    Sentry.captureException(error,{tags: {section: "admin-dashboard" }})
    return NextResponse.json({error:message},{ status: 500 })
    
  }
}