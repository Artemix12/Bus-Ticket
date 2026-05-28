"use client"

import Link from "next/link"
import { User } from "../_lib/types"
import { THEME_COLORS } from "../_lib/constants"
import { UserAvatar } from "./UserAvatar"

type DashboardHeaderProps = {
  user?: User
  onLogout?: () => void
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        borderColor: THEME_COLORS.border,
        background: "#0a0f1a",
      }}
    >
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs rounded border p-1 no-underline transition-colors hover:opacity-80"
            style={{
              color: THEME_COLORS.muted,
              borderColor: THEME_COLORS.border,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Home
          </Link>

          {/* Navigation links */}
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: THEME_COLORS.text }}
            >
              My Bookings
            </Link>
            <Link
              href="/dashboard/trips"
              className="text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: THEME_COLORS.text }}
            >
              Available Trips
            </Link>
          </nav>
        </div>

        
        {user && onLogout && (
          <UserAvatar user={user} onLogout={onLogout} />
        )}
      </div>
    </header>
  )
}

