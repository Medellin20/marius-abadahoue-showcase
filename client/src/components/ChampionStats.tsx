import { Medal, Trophy } from "lucide-react";

const achievements = [
  { count: "06", label: "Médailles d’or", Icon: Medal, accent: "text-[#886019]", badge: "bg-[#f4e4bb]", border: "border-t-[#bb9141]" },
  { count: "02", label: "Médailles d’argent", Icon: Medal, accent: "text-[#52606c]", badge: "bg-[#e5e9ed]", border: "border-t-[#96a1ad]" },
  { count: "01", label: "Médaille de bronze", Icon: Medal, accent: "text-[#8a4d2d]", badge: "bg-[#efddcf]", border: "border-t-[#b7805b]" },
  { count: "04", label: "Trophées", Icon: Trophy, accent: "text-[#9b2d35]", badge: "bg-[#f0dadd]", border: "border-t-[#9b2d35]" },
];

export default function ChampionStats() {
  return <div className="mt-10">
    <div className="mb-5 flex items-center gap-3"><span className="h-px w-6 bg-[#9b2d35]" aria-hidden="true" /><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#6c625b]">Le palmarès en chiffres</p></div>
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
      {achievements.map(({ count, label, Icon, accent, badge, border }) => <div key={label} className={`flex flex-col items-center rounded-xl border border-[#171619]/10 border-t-[3px] ${border} bg-[#fffcf7] px-3 pb-6 pt-5 text-center shadow-[0_4px_16px_rgba(23,22,25,0.04)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none sm:px-4`}>
        <dt className="contents"><span aria-hidden="true" className={`order-1 mb-4 flex h-10 w-10 items-center justify-center rounded-full ${badge} ${accent}`}><Icon className="h-5 w-5" strokeWidth={1.6} /></span><span className="order-3 mt-3 text-xs font-medium leading-5 text-[#5e5650]">{label}</span></dt>
        <dd className="order-2 font-display text-5xl font-semibold leading-none tabular-nums tracking-tight text-[#262125] sm:text-6xl">{count}</dd>
      </div>)}
    </dl>
  </div>;
}
