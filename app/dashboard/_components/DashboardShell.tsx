"use client"

import { useState } from "react"
import { Booking, User } from "../_lib/types"
import { THEME_COLORS } from "../_lib/constants"
import { DashboardHeader } from "./DashboardHeader"
import { DashboardStats } from "./DashboardStats"
import { BookingsList } from "./BookingsList"
import { BookingModal } from "./BookingModal/BookingModal"
import { useRouter } from "next/navigation"
import { authClient } from "@/utils/auth-client"
import * as Sentry from "@sentry/nextjs";

type DashboardShellProps = {
  initialBookings: Booking[]
  user?: User
}

export function DashboardShell({ initialBookings, user }: DashboardShellProps) {
  
  const [bookingModal, setBookingModal] = useState<{
    tripId: string
    trip: Booking['trip']
  } | null>(null)


  const router = useRouter()

  const handleCancelBooking = async (bookingId: string) =>
  {
   
     try 
       {
     
       const data = await fetch(`/api/v1/bookings/${bookingId}`,{
         method:'DELETE',
         credentials:'include',
       
       })
       await data.json()
       
        router.refresh()
      
       
       } catch (error) 
      {
        Sentry.captureException(error, {tags: {section: "booking-cancellation",component: "handleCancelBooking"}})
        Sentry.logger.error("Failed to cancel booking", {endpoint: `/api/v1/bookings/${bookingId}`})
          
      }
         
       
  }

   const handleLogout = async () => 
    {
      try 
      {
      await authClient.signOut()
      router.push("/login")
      } 
      catch (error) 
      {
        Sentry.captureException(error, {tags: {section: "logout",component: "DashboardShell"}})
        Sentry.logger.error("Failed to logout user", {endpoint: `/api/v1/auth/logout`})
      }
    }
 

  return (
    <>
      <div
        className="min-h-screen"
        style={{
          background: THEME_COLORS.base,
          color: THEME_COLORS.text,
        }}
      >
        <DashboardHeader user={user} onLogout={handleLogout} />

        <main className="max-w-3xl mx-auto px-5 py-5.5">
          <DashboardStats bookings={ initialBookings} />
          <BookingsList bookings={ initialBookings} onCancel={handleCancelBooking} />
        </main>
      </div>

      {bookingModal && (
        <BookingModal
          tripId={bookingModal.tripId}
          trip={bookingModal.trip}
          onClose={() => setBookingModal(null)}
        />
      )}
    </>
  )
}
