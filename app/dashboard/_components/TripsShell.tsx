"use client"
import toast, { Toaster } from 'react-hot-toast'
import { useState } from "react"
import { Trip, User } from "../_lib/types"
import { TripsList } from "./TripsList"
import { DashboardHeader } from "./DashboardHeader"
import { BookingModal } from "./BookingModal/BookingModal"
import { useRouter } from "next/navigation"
import { authClient } from "@/utils/auth-client"

type TripsShellProps = {
  initialTrips: Trip[]
  user?: User
}

export function TripsShell({ initialTrips, user }: TripsShellProps) {
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean
    tripId?: string
    trip?: {
      origin: string
      destination: string
      departureDate: string
      departureTime: string
      price: number
    }
  }>({
    isOpen: false,
  })
  const router = useRouter()

  const handleBook = (tripId: string, trip: Trip) => {
    const transformedTrip = {
      origin: trip.from,
      destination: trip.to,
      departureDate: trip.departureDate,
      departureTime: trip.departureTime,
      price: trip.price,
    }
    
    setBookingModal({
      isOpen: true,
      tripId,
      trip: transformedTrip,
    })
  }

  const handleCloseModal = () => {
    setBookingModal({
      isOpen: false,
    })
  }

  const handleLogout = async () => {
      await authClient.signOut()
  
      router.push("/login")
    }

  return (
    <>
      <Toaster position="top-center" />
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="mb-6">
          <h1
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--dashboard-text)" }}
          >
            Available Trips
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--dashboard-muted)" }}
          >
            Browse and book your next journey
          </p>
        </div>

        <TripsList trips={initialTrips} onBook={handleBook} />
      </div>

      {bookingModal.isOpen && bookingModal.trip && (
        <BookingModal
          tripId={bookingModal.tripId || ""}
          trip={bookingModal.trip}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}
