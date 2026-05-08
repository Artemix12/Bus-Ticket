'use client'
export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium tracking-wide text-sky-300 uppercase">
      {children}
    </span>
  );
}