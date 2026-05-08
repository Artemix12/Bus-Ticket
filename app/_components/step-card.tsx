'use client'
export default function StepCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/30 bg-sky-500/10 text-sm font-bold text-sky-400">
          {number}
        </span>
      </div>
      <div>
        <h4 className="mb-1 text-base font-semibold text-white">{title}</h4>
        <p className="text-sm leading-relaxed text-slate-400">{desc}</p>
      </div>
    </div>
  );
}