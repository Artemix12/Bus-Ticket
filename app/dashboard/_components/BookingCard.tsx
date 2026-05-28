"use client"

import { Booking } from "../_lib/types"
import { dateTimeFormatter,  } from "../_lib/formatters"
import { THEME_COLORS } from "../_lib/constants"


type BookingCardProps = {
  booking: Booking
  onCancel: (id: string) => void
  toastNotification:()=>void
}

export function BookingCard({ booking, onCancel,toastNotification }: BookingCardProps) {

  const canBeCancelled =!booking.isUsed
 

  const getStatusBadge = () => {
    if (booking.isUsed) {
      return {
        text: "Used",
        color: THEME_COLORS.muted,
        bg: "rgba(139,154,181,0.1)",
      }
    }

   
  
    return {
      text: "Available",
      color: THEME_COLORS.muted,
      bg: "rgba(139,154,181,0.1)",
    }
  }

  const status = getStatusBadge()



  return (
    
    <div className="booking-card">
     
      <div
        className={`h-1 ${booking.isUsed  ? "bg-opacity-30"  : "bg-opacity-30"}`}
        style={{
          background: booking.isUsed
            ? THEME_COLORS.faint
          
              : THEME_COLORS.faint,
        }}
      />

      <div className="p-4">
        {/* Route + Badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-semibold"
              style={{ color: THEME_COLORS.text }}
            >
              {booking.trip?.origin || "—"}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={THEME_COLORS.skyBlue}
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span
              className="text-sm font-semibold"
              style={{ color: THEME_COLORS.text }}
            >
              {booking.trip?.destination || "—"}
            </span>
          </div>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: status.bg,
              color: status.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: status.color }}
            />
            {status.text}
          </span>
        </div>

       
        <div
          className="grid grid-cols-3 gap-2 rounded-lg p-3 mb-3"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {[
            {
              id:0,
              label: "Departure",
              mainValue: booking.trip ? dateTimeFormatter.date(booking.trip.departureDate) : "—",
              subValue: booking.trip ? dateTimeFormatter.time(booking.trip.departureTime) : "—",
            },
            {
              id:1,
              label: "Seat",
              mainValue: `#${booking.seatNumber}`,
              subValue: `${booking.passengerCount} passenger${booking.passengerCount > 1 ? "s" : ""}`,
            },
            {
              id:2,
              label: "Total",
              mainValue: dateTimeFormatter.price(booking.totalPrice),
              subValue: booking.trip ? `${dateTimeFormatter.price(booking.trip.price)}/seat` : "—",
              highlight: true,
            },
          ].map(({ label, mainValue, subValue, highlight,id }) => (
            <div key={id}>
              <div
              className="text-xs font-medium uppercase tracking-wide mb-1"
              style={{ color: THEME_COLORS.faint }}
              >
                {label}
              </div>
              <div
                className={`font-semibold ${highlight ? "text-base" : "text-sm"}`}
                style={{
                  color: highlight ? THEME_COLORS.skyBlue : THEME_COLORS.text,
                  fontFamily: highlight ? "'DM Mono', monospace" : "inherit",
                }}
              >
                {mainValue}
              </div>
              <div className="text-xs" style={{ color: THEME_COLORS.muted }}>
                {subValue}
              </div>
            </div>
          ))}
        </div>

      
        {canBeCancelled && (
        <button
          onClick={() => {onCancel(booking._id);toastNotification()}}
          className="w-full px-3.5 py-2 rounded-lg font-medium text-xs transition-colors"
          style={{
              border: "1px solid rgba(248,113,113,0.2)",
              background: "rgba(248,113,113,0.07)",
              color: THEME_COLORS.red,
          }}
          onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
                "rgba(248,113,113,0.14)")
          }
          onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background =
              "rgba(248,113,113,0.07)")
          }
          
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  )
}
