"use client"

import { Booking } from "../../_lib/types"
import { dateTimeFormatter } from "../../_lib/formatters"
import { THEME_COLORS } from "../../_lib/constants"

type BookingStep1Props = {
  trip: Booking["trip"]
  seatNumber: string
  setSeatNumber: (value: string) => void
  passengerCount: number
  setPassengerCount: (value: number) => void
  isGift: boolean
  setIsGift: (value: boolean) => void
  onNext: () => void
}

export function BookingStep1({
  trip,
  seatNumber,
  setSeatNumber,
  passengerCount,
  setPassengerCount,
  isGift,
  setIsGift,
  onNext,
}: BookingStep1Props) {
  const totalPrice = trip.price * passengerCount
  const canProceedToStep2 = seatNumber.trim() !== ""

  return (
    <div className="flex flex-col gap-3.5">
      {/* Trip info */}
      <div
        className="grid grid-cols-2 gap-2 rounded-lg p-3 border"
        style={{
          background: THEME_COLORS.skyDim,
          borderColor: THEME_COLORS.skyBorder,
        }}
      >
        <div>
          <div
            className="text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: THEME_COLORS.faint }}
          >
            Departure
          </div>
          <div
            className="text-sm font-medium"
            style={{ color: THEME_COLORS.text }}
          >
            {dateTimeFormatter.date(trip.departureDate)}
          </div>
          <div className="text-xs" style={{ color: THEME_COLORS.muted }}>
            {dateTimeFormatter.time(trip.departureTime)}
          </div>
        </div>
        <div>
          <div
            className="text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: THEME_COLORS.faint }}
          >
            Price/seat
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

      {/* Seat number */}
      <div>
        <label
          className="block text-xs font-medium mb-1"
          style={{ color: THEME_COLORS.muted }}
        >
          Seat number <span style={{ color: THEME_COLORS.red }}>*</span>
        </label>
        <input
          type="number"
          min={1}
          placeholder="Ex: 12"
          value={seatNumber}
          onChange={(e) => setSeatNumber(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none border"
          style={{
            background: THEME_COLORS.base,
            borderColor: THEME_COLORS.border,
            color: THEME_COLORS.text,
          }}
          onFocus={(e) =>
            ((e.target as HTMLElement).style.borderColor =
              "rgba(56,189,248,0.5)")
          }
          onBlur={(e) =>
            ((e.target as HTMLElement).style.borderColor = THEME_COLORS.border)
          }
        />
      </div>

      {/* Passenger count stepper */}
      <div>
        <label
          className="block text-xs font-medium mb-1"
          style={{ color: THEME_COLORS.muted }}
        >
          Passengers
        </label>
        <div className="flex items-center gap-2.5">
          {[
            ["−", () => setPassengerCount(Math.max(1, passengerCount - 1))],
            ["+", () => setPassengerCount(passengerCount + 1)],
          ].map(([label, handler], index) => (
            <button
              key={index}
              onClick={handler as () => void}
              className="w-8.5 h-8.5 rounded flex items-center justify-center border cursor-pointer"
              style={{
                borderColor: THEME_COLORS.border,
                background: THEME_COLORS.base,
                color:
                  index === 1 ? THEME_COLORS.skyBlue : THEME_COLORS.text,
                fontSize: "17px",
              }}
            >
              {label as string}
            </button>
          ))}
          <span
            className="text-base font-semibold min-w-5 text-center"
            style={{
              color: THEME_COLORS.text,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {passengerCount}
          </span>
          <span
            className="ml-auto text-sm font-bold"
            style={{
              color: THEME_COLORS.skyBlue,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            = {dateTimeFormatter.price(totalPrice)}
          </span>
        </div>
      </div>

    
      <div
        onClick={() => setIsGift(!isGift)}
        className="px-3 py-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between"
        style={{
          background: isGift
            ? "rgba(251,191,36,0.07)"
            : "rgba(255,255,255,0.03)",
          borderColor: isGift
            ? "rgba(251,191,36,0.22)"
            : THEME_COLORS.border,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">🎁</span>
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: THEME_COLORS.text }}
            >
              Gift ticket
            </div>
            <div className="text-xs" style={{ color: THEME_COLORS.muted }}>
              Send the ticket to someone else
            </div>
          </div>
        </div>
        <div
          className="w-9 h-5 rounded-full flex-shrink-0 relative transition-colors"
          style={{
            background: isGift
              ? "#0ea5e9"
              : "rgba(255,255,255,0.15)",
          }}
        >
          <div
            className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-all"
            style={{
              left: isGift ? "19px" : "3px",
            }}
          />
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceedToStep2}
        className="w-full py-2.5 rounded-lg border-none font-semibold text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: canProceedToStep2
            ? "linear-gradient(135deg,#0369a1,#0ea5e9)"
            : "rgba(255,255,255,0.05)",
          color: canProceedToStep2 ? "#fff" : THEME_COLORS.faint,
        }}
      >
        Continue →
      </button>
    </div>
  )
}
