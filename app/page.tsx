import NavBar from "./_components/navbar";
import Footer from "./_components/footer";
import Link from "next/link";
import Badge from './_components/badge'
import FeatureCard from './_components/feature-card'
import StepCard from './_components/step-card'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <NavBar/>


      <section className="relative mx-auto max-w-7xl px-6 pb-24 pt-24 md:px-8 md:pt-32">
        {/* subtle grid background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]"
        />
       

        <div className="relative flex flex-col items-center text-center">
          <Badge>✦ Make your trip easier</Badge>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl">
            Book your bus ticket{" "}
            <span className="text-sky-400">in seconds.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-slate-400">
            Search routes, reserve seats, and get a digital QR ticket straight
            to your phone — fast, simple, and always on time.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-sky-900 px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm font-semibold text-sky-100 shadow-lg shadow-sky-900/30 transition-all duration-300 ease-in-out hover:scale-105 sm:hover:scale-110 hover:bg-sky-800 hover:text-white"
            >
              Book a Ticket
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs sm:px-6 sm:py-3 sm:text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
            >
              Explore Routes
            </Link>
          </div>

     
        </div>
      </section>

      
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <div className="mb-12 text-center">
          <Badge>Features</Badge>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white md:text-4xl">
            Everything you need to travel smarter
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            A complete platform built for passengers and operators alike.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            }
            title="Smart Route Search"
            desc="Find available buses between any two cities in real time with live seat availability."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                />
              </svg>
            }
            title="QR Digital Tickets"
            desc="Receive a unique QR code after booking. No printing needed — just scan and board."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            }
            title="Personal Dashboard"
            desc="Manage all your bookings, view travel history, and track upcoming trips from one place."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            }
            title="Secure Authentication"
            desc="Your account and payment data are protected with industry-standard security protocols."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                />
              </svg>
            }
            title="Mobile-First Design"
            desc="Fully responsive interface optimized for any screen — book on your phone in under a minute."
          />
          <FeatureCard
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6.75v6.75"
                />
              </svg>
            }
            title="Admin Dashboard"
            desc="Full back-office control over routes, schedules, buses, reservations, and users."
          />
        </div>
      </section>

      
      <section className="border-t border-white/6 bg-white/2 py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 text-center">
            <Badge>How it works</Badge>
            <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-white md:text-4xl">
              Travel in 3 simple steps
            </h2>
          </div>

          <div className="mx-auto grid max-w-3xl gap-8">
            <StepCard
              number="01"
              title="Search your route"
              desc="Enter your departure city, destination, and travel date. See all available buses with schedules and seat availability."
            />
            <div className="hidden sm:block ml-4.25 h-8 w-px bg-white/10" />
            <StepCard
              number="02"
              title="Choose your seat & pay"
              desc="Pick your preferred seat from an interactive seat map and complete your booking with a secure payment."
            />
            <div className="hidden sm:block ml-4.25 h-8 w-px bg-white/10" />
            <StepCard
              number="03"
              title="Board with your QR ticket"
              desc="Receive your digital QR-code ticket instantly. Show it at the gate — no printing required."
            />
          </div>
        </div>
      </section>

   
      <section className="mx-auto max-w-7xl px-6 py-24 md:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-sky-500/20 bg-sky-950/30 px-6 py-12 sm:px-8 sm:py-16 text-center">
         
          <div className="relative">
            <Badge>Get started today</Badge>
            <h2 className="mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to book your next trip?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm sm:text-base text-slate-400 ">
              Create a free account in seconds and start exploring routes near
              you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg transition-all ease-in-out duration-200 hover:scale-105 sm:hover:scale-110 bg-sky-800 px-5 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-semibold text-sky-100 shadow-lg shadow-sky-900/30  hover:bg-sky-700 hover:text-white"
              >
                Create a free account
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 sm:px-7 sm:py-3 text-xs sm:text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
              >
                Learn more
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}