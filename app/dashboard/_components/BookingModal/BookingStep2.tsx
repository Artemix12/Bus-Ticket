"use client"

import { useState } from "react"
import { Booking } from "../../_lib/types"
import { dateTimeFormatter } from "../../_lib/formatters"
import { THEME_COLORS } from "../../_lib/constants"
import { Skeleton } from "@/components/ui/skeleton"

type BookingStep2Props = {
  trip: Booking["trip"]
  seatNumber: string
  passengerCount: number
  isGift: boolean
  recipientEmail: string
  setRecipientEmail: (value: string) => void
  onBack: () => void
  onSubmit: () => Promise<void>
}

export function BookingStep2({
  trip,
  seatNumber,
  passengerCount,
  isGift,
  recipientEmail,
  setRecipientEmail,
  onBack,
  onSubmit,
}: BookingStep2Props) {
  const [isLoading, setIsLoading] = useState(false)
  const totalPrice = trip.price * passengerCount
  const canSubmitBooking = !isGift || recipientEmail.trim() !== ""

  const handleSubmitClick = async () => {
    setIsLoading(true)
    try {
      await onSubmit()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-3.5">
    
      {isGift && (
        <div>
          <label
            className="block text-xs font-medium mb-1"
            style={{ color: THEME_COLORS.muted }}
          >
            Recipient email <span style={{ color: THEME_COLORS.red }}>*</span>
          </label>
          <input
            type="email"
            placeholder="friend@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
            style={{
              background: THEME_COLORS.base,
              borderColor: "rgba(251,191,36,0.3)",
              color: THEME_COLORS.text,
            }}
            onFocus={(e) =>
              ((e.target as HTMLElement).style.borderColor =
                "rgba(251,191,36,0.6)")
            }
            onBlur={(e) =>
              ((e.target as HTMLElement).style.borderColor =
                "rgba(251,191,36,0.3)")
            }
          />
        </div>
      )}

     
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${THEME_COLORS.border}`,
        }}
      >
        {[
          ["Route", `${trip.origin} → ${trip.destination}`],
          [
            "Date",
            `${dateTimeFormatter.date(trip.departureDate)} · ${dateTimeFormatter.time(trip.departureTime)}`,
          ],
          ["Seat", `#${seatNumber}`],
          ["Passengers", `${passengerCount}`],
          ...(isGift && recipientEmail ? [["For", recipientEmail]] : []),
        ].map(([key, value], index) => (
          <div
            key={key}
            className="flex justify-between px-3 py-2"
            style={{
              borderBottom:
                index < 3 ? `1px solid ${THEME_COLORS.border}` : "none",
            }}
          >
            <span className="text-xs" style={{ color: THEME_COLORS.muted }}>
              {key}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: THEME_COLORS.text }}
            >
              {value}
            </span>
          </div>
        ))}
        <div
          className="flex justify-between items-center px-3 py-2.5"
          style={{
            borderTop: `1px solid ${THEME_COLORS.skyBorder}`,
            background: THEME_COLORS.skyDim,
          }}
        >
          <span className="text-xs" style={{ color: THEME_COLORS.muted }}>
            Total
          </span>
          <span
            className="text-lg font-bold"
            style={{
              color: THEME_COLORS.skyBlue,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {dateTimeFormatter.price(totalPrice)}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onBack}
          className="px-3.5 py-2.5 rounded-lg border font-medium text-sm transition-colors"
          style={{
            borderColor: THEME_COLORS.border,
            background: "transparent",
            color: THEME_COLORS.muted,
          }}
          disabled={isLoading}
        >
          ← Back
        </button>
        <button
          onClick={handleSubmitClick}
          disabled={!canSubmitBooking || isLoading}
          className="flex-1 py-2.5 rounded-lg border-none font-semibold text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          style={{
            background: canSubmitBooking && !isLoading
              ? "linear-gradient(135deg,#0369a1,#0ea5e9)"
              : "rgba(255,255,255,0.05)",
            color: canSubmitBooking ? "#fff" : THEME_COLORS.faint,
          }}
        >
          {isLoading ? (
            <Skeleton className="w-6 h-4 rounded" />
          ) : isGift ? (
            "🎁 Send Gift"
          ) : (
            "Confirm Booking"
          )}
        </button>
      </div>

      
    </div>
  )
}
