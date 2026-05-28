import { Booking } from "../_lib/types"
import { dateTimeFormatter } from "../_lib/formatters"
import { THEME_COLORS } from "../_lib/constants"

type DashboardStatsProps = {
  bookings: Booking[]
}

export function DashboardStats({ bookings }: DashboardStatsProps) {
  const totalSpent = bookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const activeBookings = bookings.filter(
    booking => !booking.isUsed 
  ).length

  const usedTickets = bookings.filter(booking => booking.isUsed).length

  const stats = [
    {
      label: "Total spent",
      value: dateTimeFormatter.price(totalSpent),
      color: THEME_COLORS.skyBlue,
      accent: true,
    },
    {
      label: "Active bookings",
      value: String(activeBookings),
      color: THEME_COLORS.green,
      accent: false,
    },
    {
      label: "Used tickets",
      value: String(usedTickets),
      color: THEME_COLORS.muted,
      accent: false,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-2.5 mb-6">
      {stats.map(({ label, value, color, accent }) => (
        <div
          key={label}
          className="rounded-lg p-3.5 border"
          style={{
            background: accent
              ? THEME_COLORS.skyDim
              : THEME_COLORS.card,
            borderColor: accent
              ? THEME_COLORS.skyBorder
              : THEME_COLORS.border,
          }}
        >
          <div
            className="text-xs font-medium uppercase tracking-wide mb-1"
            style={{ color: THEME_COLORS.faint }}
          >
            {label}
          </div>
          <div
            className={`font-bold ${accent ? "text-base" : "text-2xl"}`}
            style={{ color, fontFamily: "'DM Mono', monospace" }}
          >
            {value}
          </div>
        </div>
      ))}
    </div>
  )
}
