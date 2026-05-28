import { DashboardShell } from "./_components/DashboardShell"
import { Booking, User } from "./_lib/types"
import { auth } from "@/utils/auth"
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as Sentry from "@sentry/nextjs";

export const metadata ={
  title:{
    absolute:'Booking Dashboard'
  },
  description:'Manage your bookings and view your dashboard'
}
async function getDashboardData(): Promise<Booking[]> {
  try 
  {
    const cookieStore = await cookies()
    const baseUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
    const data = await fetch(`${baseUrl}/api/v1/bookings`,{
      headers:{
        Cookie:cookieStore.toString()
      }
    })

    if(!data.ok)
    {
      return[]
    }
    const res = await data.json()
   
    return res.data ?? []
   
  } catch (error) 
  {
    Sentry.captureException(error, {
    tags: {
    section: "dashboard-data",
    component: "getDashboardData"
    }
  })

  Sentry.logger.error("Failed to fetch dashboard data")
  return []
  }
     
   
    
}

async function getUserSession(): Promise<User> {
 
    const session = await auth.api.getSession({
      headers: await headers(),
    })

   

    if (!session){
      redirect('/login')
    } 

    return {
      id: session.user.id || "",
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  } 



export default async function DashboardPage() {

  const [bookings, user] = await Promise.all([
    getDashboardData(),
    getUserSession(),
  ])

  return <DashboardShell initialBookings={bookings} user={user} />
}

