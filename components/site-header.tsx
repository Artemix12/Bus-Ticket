import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header
      className="
        sticky top-0 z-30
        flex h-(--header-height)
        shrink-0 items-center
        border-b border-white/10
        bg-[#0d1117]/80
        backdrop-blur-xl
      "
    >
      <div className="flex w-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1 text-slate-400 hover:text-white" />

          <Separator
            orientation="vertical"
            className="h-4 bg-white/10"
          />

          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-white">
              Admin Dashboard
            </h1>

            <p className="text-xs text-slate-500">
              Manage trips, bookings and users
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}