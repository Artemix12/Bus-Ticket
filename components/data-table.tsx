"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import{useState,useEffect} from 'react'
import * as Sentry from "@sentry/nextjs";


interface Booking
{
  passengerName:string, 
  passengerEmail:string,
  origin:string, 
  destination:string, 
  departureDate:string,
  passengerCount:number
  departureTime:string, 
  seatNumber:number, 
  tripPrice:number
  totalPrice:number, 
  status:string
  isUsed:boolean
}
 
interface BookingStats
{
  data:{
    allBookings:Booking[]
  }
}

export function RecentBookingsTable() {

  const[bookingStats,setBookingStats] = useState <BookingStats|null> (null)

  useEffect(()=>{
    async function fetchBookingStats()
    {
      try 
      {
        const data = await fetch('/api/v1/admin/stats',{
        credentials:'include'
      })
      const res = await data.json()

      if(res.success)
      {
        return setBookingStats(res)
      }
      } 
      catch (error) 
      {
        Sentry.captureException(error, {
        tags: {
        section: "recent-bookings-table",
        component: "RecentBookingsTable"
        }
      })

      Sentry.logger.error("Failed to fetch recent bookings", {
      endpoint: "/api/v1/admin/stats"
  })
    }
  }

    fetchBookingStats()
  
  },[])
   



  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#111111] p-5">

  <div className="mb-5">
    <h2 className="text-lg font-semibold text-white">
    Recent Bookings
    </h2>

    <p className="text-sm text-zinc-400">
      Manage and monitor recent reservations
    </p>
  </div>

  <div className="w-full overflow-x-auto">
    <Table className="w-full table-auto">

      <TableHeader>
      <TableRow className="border-white/10 hover:bg-transparent">

      <TableHead className="font-semibold text-zinc-400">
        Passenger
      </TableHead>

      <TableHead className="font-semibold text-zinc-400">
        Route
      </TableHead>

      <TableHead className="text-center font-semibold text-zinc-400">
       Departure
      </TableHead>

          <TableHead className="text-center font-semibold text-zinc-400">
            Time
          </TableHead>

          <TableHead className="text-center font-semibold text-zinc-400">
            Seats
          </TableHead>

          <TableHead className="text-center font-semibold text-zinc-400">
            Trip Price
          </TableHead>

          <TableHead className="text-center font-semibold text-zinc-400">
            Total Price
          </TableHead>

          <TableHead className="text-center font-semibold text-zinc-400">
            Status
          </TableHead>

        </TableRow>
      </TableHeader>

      <TableBody>

        {bookingStats?.data.allBookings.map((booking, index) => (

          <TableRow
            key={index}
            className="border-white/5 transition-colors hover:bg-white/5"
          >

            <TableCell>
              <div className="flex flex-col">

                <span className="font-medium text-white">
                  {booking.passengerName}
                </span>

                <span className="text-xs text-zinc-500">
                  {booking.passengerEmail}
                </span>

              </div>
            </TableCell>

            <TableCell className="text-zinc-300">
              {booking.origin} → {booking.destination}
            </TableCell>

            <TableCell className="text-center text-zinc-300">
              {new Date(booking.departureDate).toLocaleDateString('fr-Fr')}
            </TableCell>

            <TableCell className="text-center text-zinc-300">
              {new Date(booking.departureTime).toLocaleTimeString()}
            </TableCell>

            <TableCell className="text-center text-zinc-300">
              {booking.passengerCount}
            </TableCell>

            <TableCell className="text-center font-medium text-cyan-400">
              ${booking.tripPrice}
            </TableCell>

            <TableCell className="text-center font-medium text-emerald-400">
              ${booking.tripPrice * booking.passengerCount}
            </TableCell>

            <TableCell className="text-center">

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium
                ${
                  !booking.isUsed
                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    : "border border-red-500/20 bg-red-500/10 text-red-400"
                }`}
              >
                {booking.isUsed ? "Used":"Active"}
              </span>

            </TableCell>

          </TableRow>

        ))}

      </TableBody>

    </Table>
  </div>

</div>
  )
}