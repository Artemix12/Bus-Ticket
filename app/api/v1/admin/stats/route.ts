import {NextRequest,NextResponse} from 'next/server'
import { auth } from "@/utils/auth"
import dbConnect from '@/dbconfig/mongoose'
import Trip from "@/models/trip.model"
import bookingModel from '@/models/booking.model'
import {headers} from 'next/headers'

dbConnect()

export async function GET(request:NextRequest)
{
  try {

    const session = await auth.api.getSession({
    headers: await headers() 
    })
    
    if(!session || session.user.role !=='admin' ){
    return NextResponse.json({error:'Unauthorized'},{status:401})
    } 

    const data = await auth.api.listUsers({
	query: { limit: 1 },
	headers: await headers()
})

    const totalTrips = await Trip.countDocuments()
    const totalBookings = await bookingModel.countDocuments()
    const totalUsers =  data.total
    const activeTrips = await Trip.countDocuments({'status':'active'})
    const cancelledTrips = await Trip.countDocuments({'status':'cancelled'})
    const totalRevenue = await Trip.aggregate([
      {
        $group:{
          _id:null,
          totalRevenue:{$sum:'$price'}

        }
      },
      {
        $project:{
          _id:0,
        }
      }
    ])

    
    const revenue = totalRevenue[0]?.totalRevenue || 0


    return NextResponse.json({
    success:true,
    status:200,
    data:{
    totalTrips,
    totalBookings,
    totalUsers,
    activeTrips,
    cancelledTrips,
    revenue: revenue
    
    }
    })

    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({error:message},{ status: 500 })
    
  }
}