import { headers } from "next/headers"
import { auth } from "@/utils/auth"
import { TripsShell } from "../_components/TripsShell"
import { Trip, User } from "../_lib/types"
import { cookies } from 'next/headers'
import {redirect} from 'next/navigation'
import * as Sentry from "@sentry/nextjs";

export const metadata = 
{
  title: {
    absolute:"Trips Dashboard"
  },
  description: "View and manage your trips",
}
async function getTripsData(): Promise<Trip[]> {
  try {
    const cookie = await cookies()
    const response = await fetch("http://localhost:3000/api/v1/trip", {
      headers: {
        Cookie:cookie.toString()
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch trips:", response.status)
      return []
    }

    const data = await response.json()
    return data.data ?? []
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
      section: "trips-data",
      component: "getTripsData"
      }
    })
    Sentry.logger.error("Failed to fetch trips")
    return []
  }
}

async function getUserSession(): Promise<User | undefined> {
 
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    
    if (!session?.user){
      return redirect('/login')
    } 
    
    return {
      id: session.user.id || "",
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    }
  
}

export default async function TripsPage() {
  const [trips, user] = await Promise.all([
    getTripsData(),
    getUserSession(),
  ])

  return <TripsShell initialTrips={trips} user={user} />
}
