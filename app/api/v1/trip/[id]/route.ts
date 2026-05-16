import {NextRequest,NextResponse} from 'next/server'
import {headers} from 'next/headers'
import { auth } from "@/utils/auth"
import Trip from "@/models/trip.model"
import dbConnect from '@/dbconfig/mongoose'



export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>})
{
  try{
 
    await dbConnect()
    const session = await auth.api.getSession({
    headers: await headers() 
    })

    if(!session ){
    return NextResponse.json({error:'Unauthorized'},{status:401})
    }
    const {id} = await params

    if(!id)
    {
      return NextResponse.json({error:'Id is missing'},{status:400})
    }

    const findTripDetail = await Trip.findById(id)

    if(!findTripDetail){
      return NextResponse.json({message:'Trip not found'},{status:404})  
    }

    return NextResponse.json({
    success:true,
    data:findTripDetail,
    message: 'Trip details retrieved successfully'
    },
    {
     status:200
    })

    
  } catch (error) 
  {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({error:message},{ status: 500 })
  }
}

export async function PATCH(request:NextRequest,{params}:{params:Promise<{id:string}>})
{
  try {

    const session = await auth.api.getSession({
    headers: await headers() 
    })

    if(!session || session.user.role !=='admin' ){
    return NextResponse.json({error:'Unauthorized',status:401})
    }

    const{id}=await params

    if(!id)
    {
      return NextResponse.json({error:'Id is missing'},{status:400})
    }
    
    const{status} =  await request.json()

    if(!status)
    {
      return NextResponse.json({error:'status is missing'},{status:400})
    }

    const availableStatus=['available','cancelled']

    if(!availableStatus.includes(status))
    {
      return NextResponse.json(
       { message: "Invalid status, must be one of: available, cancelled" },
       { status: 422 }
      )
    }
   
    const changeTripStatus = await Trip.findByIdAndUpdate(
      id,
      {
        status:status
      },
      {returnDocument: 'after'}
    )

    if(!changeTripStatus){
    return NextResponse.json(
    { message: "Trip not found" },
    { status: 404 }
    )
   }

  return NextResponse.json({
    success:true,
    data:changeTripStatus,
    message:'Trip status updated successfully'
    
  },
  {
   status:200,
  })


  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({
    error:message
    },
    {
    status:500
    })
    
  }
}