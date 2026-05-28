'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-8">

       
        <div className="flex items-center gap-2.5 group">
          <Image
            src="/bus.png"
            alt="BusTicket logo"
            width={55}
            height={55}
            loading={"eager"}
            className="rounded-md h-8 w-auto"
            style={{ width: 'auto', height: '55px' }}
          />
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Bus<span className="text-sky-400">Ticket</span>
          </span>
        </div>

       
        <nav className="hidden items-center gap-1 md:flex">

          <Link
            href="#"
            className="rounded-md px-4 py-1.5 text-lg font-medium text-white transition hover:text-sky-400 hover:bg-white/[0.07]"
          >
            Home
          </Link>

          <Link
            href="#"
            className="rounded-md px-4 hover:text-sky-400 py-1.5 text-lg font-medium text-slate-300 transition  hover:bg-white/[0.07]"
          >
            Explore
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 rounded-md hover:text-sky-400 px-4 py-1.5 text-lg font-medium text-slate-300 transition  hover:bg-white/[0.07]"
          >
            Book Ticket
           
          </Link>

        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/signup"
            className="hidden items-center gap-2 text-sm sm:text-lg rounded-md border border-sky-900/60 bg-sky-950/50 px-3 sm:px-4 py-1.5 font-medium text-sky-200 transition hover:bg-sky-900/50 hover:text-white md:inline-flex"
          >
            Sign-up
          </Link>
          <Link  
            href="/login"
            className="hidden sm:inline-flex text-lg items-center bg-sky-950/50 gap-1.5 rounded-md px-4 py-1.5  font-semibold text-white  transition  hover:bg-sky-900 "
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd"/>
              <path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z" clipRule="evenodd"/>
            </svg>
            Login
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/[0.07] transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0d1117]">
          <div className="px-6 py-4 space-y-3">
            <Link
              href="#"
              className="block rounded-md px-4 py-2 text-base font-medium text-white transition hover:text-sky-400 hover:bg-white/[0.07]"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            <Link
              href="#"
              className="block rounded-md px-4 py-2 text-base font-medium text-slate-300 transition hover:text-sky-400 hover:bg-white/[0.07]"
              onClick={() => setIsOpen(false)}
            >
              Explore
            </Link>

            <Link
              href="#"
              className="block rounded-md px-4 py-2 text-base font-medium text-slate-300 transition hover:text-sky-400 hover:bg-white/[0.07]"
              onClick={() => setIsOpen(false)}
            >
              Book Ticket
            </Link>

            <div className="border-t border-white/[0.06] pt-3 space-y-2">
              <Link
                href="/signup"
                className="block rounded-md border border-sky-900/60 bg-sky-950/50 px-4 py-2 text-base font-medium text-sky-200 transition hover:bg-sky-900/50 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Sign-up
              </Link>
              <Link
                href="/login"
                className="block rounded-md bg-sky-950/50 px-4 py-2 text-base font-semibold text-white transition hover:bg-sky-900"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}