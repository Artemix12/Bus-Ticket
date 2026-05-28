"use client"

import { Trip } from "../_lib/types"
import { TripCard } from "./TripCard"
import { THEME_COLORS } from "../_lib/constants"

type TripsListProps = {
  trips: Trip[]
  onBook: (tripId: string, trip: Trip) => void
}

export function TripsList({ trips, onBook }: TripsListProps) {
  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke={THEME_COLORS.muted}
          strokeWidth="1.5"
          className="mb-3"
        >
          <path d="M9 11l3 3L22 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p
          className="text-sm font-medium"
          style={{ color: THEME_COLORS.muted }}
        >
          No trips available at the moment
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {trips.map((trip) => (
        <TripCard
          key={trip._id}
          trip={trip}
          onBook={onBook}
        />
      ))}
    </div>
  )
}
