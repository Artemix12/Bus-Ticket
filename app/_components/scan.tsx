"use client"

import { useEffect, useState,useCallback,useRef } from "react"
import * as Sentry from "@sentry/nextjs";

type ScanState = "loading" | "success" | "error"

type ScanResponse = {
  message?: string
  error?: string
}

type Props = {
  id:string
  }

export default function ScanPage({id}:Props) {
 

  const [state, setState] = useState<ScanState>("loading")
  const [message, setMessage] = useState("Validating ticket...")
  
  const scanTicket = useCallback(async()=>{
    try {
      const response = await fetch(`/api/v1/bookings/${id}/scan`, {
        method: "PATCH",
       
      })

    const data: ScanResponse = await response.json()

    if (!response.ok) {
      setState("error")
      setMessage(data.error || "Invalid ticket")
      return
    }

      setState("success")
      setMessage(data.message || "Ticket validated successfully")
    } 
    catch (error) {
    Sentry.captureException(error, {
    tags: 
    {
      section: "scan-ticket",
      component: "scanTicket"
    }
  })

  Sentry.logger.error("Failed to scan ticket", {
    endpoint: `/api/v1/bookings/${id}/scan`
  })

  setState("error")
  setMessage("Network error")
  }

  },[id])

  const hasScanned = useRef(false)

  useEffect(()=>{
    if(hasScanned.current)return
    hasScanned.current=true
    scanTicket()
  },[scanTicket])


  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Ticket Scanner
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Scan and validate passenger tickets
          </p>
        </div>

        {/* Scanner Box */}
        <div className="mb-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-950 p-8">
          <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">

            {state === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-sky-400" />

                <span className="text-sm text-zinc-400">
                  Validating...
                </span>
              </div>
            )}

            {state === "success" && (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <svg
                    className="h-7 w-7 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <span className="text-base font-medium text-emerald-400">
                  Ticket Approved
                </span>
              </div>
            )}

            {state === "error" && (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                  <svg
                    className="h-7 w-7 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </div>

                <span className="text-base font-medium text-red-400">
                  Scan Failed
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Result */}
        <div
          className={`rounded-xl border p-4 text-sm ${
            state === "success"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300"
              : state === "error"
              ? "border-red-500/20 bg-red-500/5 text-red-300"
              : "border-white/10 bg-white/[0.03] text-zinc-300"
          }`}
        >
          {message}
        </div>

        {/* Retry */}
        {state === "error" && (
          <button
            onClick={scanTicket}
            disabled={message==='Booking is already scanned'&&true}
            className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Try Again
          </button>
        )}
      </div>
    </main>
  )
}