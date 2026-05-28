"use client"

import { Trip } from "../_lib/types"
import { dateTimeFormatter } from "../_lib/formatters"
import { THEME_COLORS } from "../_lib/constants"

type TripCardProps = {
  trip: Trip
  onBook: (tripId: string, trip: Trip) => void
}

export function TripCard({ trip, onBook }: TripCardProps) {
  const getStatusColor = () => {
    switch (trip.status.toLowerCase()) {
      case "available":
        return THEME_COLORS.green
      case "full":
        return THEME_COLORS.red
      default:
        return THEME_COLORS.muted
    }
  }

  const getSeatsColor = () => {
    const seatsPercentage = (trip.remainingSeat / trip.totalSeat) * 100
    if (seatsPercentage > 50) return THEME_COLORS.green
    if (seatsPercentage > 20) return "#fbbf24"
    return THEME_COLORS.red
  }

  return (
    <div
      className="booking-card hover:shadow-lg"
      style={{
        background: THEME_COLORS.card,
        border: `1px solid ${THEME_COLORS.border}`,
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: 3,
          background: getStatusColor(),
        }}
      />

      <div className="p-4">
        {/* Route + Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold" style={{ color: THEME_COLORS.text }}>
              {trip.from}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={THEME_COLORS.skyBlue}
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span className="text-lg font-semibold" style={{ color: THEME_COLORS.text }}>
              {trip.to}
            </span>
          </div>

          <span
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: `${getStatusColor()}20`,
              color: getStatusColor(),
            }}
          >
            {trip.remainingSeat===0 ? "Full" : trip.status}
          </span>
        </div>

        {/* Key Info Grid */}
        <div
          className="grid grid-cols-4 gap-3 rounded-lg p-3 mb-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div>
            <div
              className="text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: THEME_COLORS.faint }}
            >
              Date
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: THEME_COLORS.text }}
            >
              {dateTimeFormatter.date(trip.departureDate)}
            </div>
          </div>

          <div>
            <div
              className="text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: THEME_COLORS.faint }}
            >
              Time
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: THEME_COLORS.text }}
            >
              {dateTimeFormatter.time(trip.departureTime)}
            </div>
          </div>

          <div>
            <div
              className="text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: THEME_COLORS.faint }}
            >
              Available
            </div>
            <div
              className="text-sm font-semibold"
              style={{ color: getSeatsColor() }}
            >
              {trip.remainingSeat}/{trip.totalSeat}
            </div>
          </div>

          <div>
            <div
              className="text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: THEME_COLORS.faint }}
            >
              Price
            </div>
            <div
              className="text-base font-bold"
              style={{
                color: THEME_COLORS.skyBlue,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {dateTimeFormatter.price(trip.price)}
            </div>
          </div>
        </div>

        
        <button
          onClick={() => onBook(trip._id || "", trip)}
          disabled={trip.remainingSeat === 0}
          className="w-full px-4 py-2.5 rounded-lg border-none font-semibold text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: trip.remainingSeat === 0 
              ? "rgba(255,255,255,0.05)" 
              : "linear-gradient(135deg,#0369a1,#0ea5e9)",
            color: trip.remainingSeat === 0 ? THEME_COLORS.faint : "#fff",
          }}
        >
          {trip.remainingSeat === 0 ? "No seats available" : "Book Now"}
        </button>
      </div>
    </div>
  )
}
