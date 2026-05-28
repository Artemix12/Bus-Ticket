"use client"
import toast, { Toaster } from 'react-hot-toast'
import { Booking } from "../_lib/types"
import { BookingCard } from "./BookingCard"
import { THEME_COLORS } from "../_lib/constants"

type BookingsListProps = {
  bookings: Booking[]
  onCancel: (id: string) => void
}

export function BookingsList({ bookings, onCancel }: BookingsListProps) {
 
  if (bookings.length === 0) {
    return (
      <div className="text-center py-13" style={{ color: THEME_COLORS.faint }}>
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(56,189,248,0.25)"
          strokeWidth="1.5"
          className="block mx-auto mb-3"
        >
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <path d="M16 8h4l3 3v5h-7V8z" />
        </svg>
        <div className="text-sm font-medium" style={{ color: THEME_COLORS.muted }}>
          No bookings yet
        </div>
      </div>
    )
  }

  const notify = () => toast.success('Ticket cancelled successfully!')

  return (
    <div className="flex flex-col gap-3">
        <Toaster position="top-center" />
      {bookings.map((booking) => (
        
        <BookingCard
          key={booking._id}
          booking={booking}
          onCancel={onCancel}
          toastNotification={notify}
        />
      ))}
    </div>
  )
}
