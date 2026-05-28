"use client"
import toast, { Toaster } from 'react-hot-toast'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Booking } from "../../_lib/types"
import { THEME_COLORS } from "../../_lib/constants"
import { BookingStep1 } from "./BookingStep1"
import { BookingStep2 } from "./BookingStep2"
import * as Sentry from "@sentry/nextjs";

type BookingModalProps = {
  tripId: string
  trip: Booking['trip']
  onClose: () => void
}

export function BookingModal({
  tripId,
  trip,
  onClose,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [seatNumber, setSeatNumber] = useState("")
  const [passengerCount, setPassengerCount] = useState(1)
  const [isGift, setIsGift] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState("")

   const notifyGiftSuccess = () => toast.success(`🎁 Gift ticket sent successfully to email ${recipientEmail!==''&& recipientEmail} !`,{
     duration: 5000
   })
   const notifyBookingSuccess = () => toast.success('✓ Booking confirmed successfully! Please check your email for details.',{
    duration: 5000
   })

   const router = useRouter()
  

  const handleSubmit = async () => {
    try 
    {
      if (isGift) {

      const data = await fetch(`/api/v1/bookings/${tripId}/gift`,{
        method:"POST",
        credentials:'include',
        body:JSON.stringify({seatNumber: Number(seatNumber),passengerCount, giftRecipient: recipientEmail})
      })

      if(!data.ok)
      {
        Sentry.logger.error("Failed to create gift booking", {endpoint: `/api/v1/bookings/${tripId}/gift`})
        return
      }
      const res = await data.json()
      if(!res)
      {
        Sentry.logger.error("Failed to parse gift booking response", {endpoint: `/api/v1/bookings/${tripId}/gift`})
        return
      }

      notifyGiftSuccess()
      router.refresh()
      onClose()
    
      
      
    } else {
        const data = await fetch(`/api/v1/bookings/${tripId}`,{
        method:"POST",
        credentials:'include',
        body:JSON.stringify({seatNumber: Number(seatNumber),passengerCount})
      })

      if(!data.ok)
      {
        Sentry.logger.error("Failed to create booking", {endpoint: `/api/v1/bookings/${tripId}`})
        return
      }

      const res = await data.json()
      if(!res)
      {
        Sentry.logger.error("Failed to parse booking response", {endpoint: `/api/v1/bookings/${tripId}`})
        return
      }
      
      notifyBookingSuccess()
      router.refresh()
      onClose() 
    }
    }
    catch (error) 
    {
    Sentry.captureException(error, {tags: {section: "booking-form",component: "handleSubmit"}})
    Sentry.logger.error("Failed to create booking", {endpoint: isGift ? `/api/v1/bookings/${tripId}/gift` : `/api/v1/bookings/${tripId}`})}
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
        
      <div className="modal-content">
        {/* Header */}
        <div
          className="px-5 py-3 border-b flex items-center justify-between"
          style={{ borderColor: THEME_COLORS.border }}
        >
          <div>
            <div
              className="font-semibold text-sm"
              style={{ color: THEME_COLORS.text }}
            >
              {isGift ? "🎁 Gift a ticket" : "Book a ticket"}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: THEME_COLORS.muted }}
            >
              {trip?.origin} → {trip?.destination}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center"
            style={{
              border: `1px solid ${THEME_COLORS.border}`,
              background: "transparent",
              color: THEME_COLORS.muted,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: step === 1 ? "50%" : "100%",
              background: `linear-gradient(90deg, #0369a1, ${THEME_COLORS.skyBlue})`,
            }}
          />
        </div>

        <div className="p-5">
          {/* ── Step 1 ── */}
          {step === 1 && (
            <BookingStep1
              trip={trip}
              seatNumber={seatNumber}
              setSeatNumber={setSeatNumber}
              passengerCount={passengerCount}
              setPassengerCount={setPassengerCount}
              isGift={isGift}
              setIsGift={setIsGift}
              onNext={() => setStep(2)}
            />
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <BookingStep2
              trip={trip}
              seatNumber={seatNumber}
              passengerCount={passengerCount}
              isGift={isGift}
              recipientEmail={recipientEmail}
              setRecipientEmail={setRecipientEmail}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}
