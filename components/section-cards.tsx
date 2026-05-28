'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  BusIcon,
  TicketIcon,
  UsersIcon,
  WalletIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react"

import {useState,useEffect} from 'react'


interface Stats
{
  data:{
  totalTrips:number,
  totalBookings:number,
  totalUsers:number,
  revenue:number,
  activeTrips:number,
  cancelledTrips:number
  }

}


export  function SectionCards() {

  const[stats,setStats] = useState<Stats|null>(null)

  useEffect(()=>{
   
    async function fetchAdminStats()
    {
    const data = await fetch('/api/v1/admin/stats',{
      credentials:'include'
    })
      
    const res = await data.json()
      
    if(res.success)
    {
      return setStats(res)
    }
    }

    fetchAdminStats()

  },[])

   
   const cards = [
    { title: "Total Trips", value: stats?.data.totalTrips,     icon: BusIcon,         prefix: ""  },
    { title: "Bookings",    value: stats?.data.totalBookings,  icon: TicketIcon,      prefix: ""  },
    { title: "Users",       value: stats?.data.totalUsers,     icon: UsersIcon,       prefix: ""  },
    { title: "Revenue",     value: stats?.data.revenue,        icon: WalletIcon,      prefix: "$" },
    { title: "Active Trips",   value: stats?.data.activeTrips,    icon: CheckCircleIcon, prefix: ""  },
    { title: "Cancelled Trips", value: stats?.data.cancelledTrips, icon: XCircleIcon,     prefix: ""  },
  ] 
  

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-3 lg:px-6">
      
    {cards.map((item)=>{
    const Icon = item.icon
    return(
    <Card
    key={item.title}
    className="
    border border-white/10
    bg-white/[0.03]
      backdrop-blur-sm
      shadow-none
      transition-all
      duration-300
    hover:border-sky-800
    hover:bg-white/[0.05]">

    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
    <CardTitle className="text-sm font-medium text-slate-400">
    {item.title}
    </CardTitle>
    <div
    className="
    flex h-10 w-10 items-center justify-center
    rounded-xl
    border border-sky-500/20
  bg-sky-500/10
  text-sky-400">

    <Icon className="h-5 w-5" />
    </div>
    </CardHeader>
    <CardContent>
    <div className="text-3xl font-bold tracking-tight text-white">
    {stats ?
    <> {item.prefix}{item.value}</>
   :(
    <div className="h-8 w-24 animate-pulse rounded-md bg-white/10" /> 
   )}
  </div>
  </CardContent>
  </Card>
  )
  })}
        
        
  </div>
  )
}