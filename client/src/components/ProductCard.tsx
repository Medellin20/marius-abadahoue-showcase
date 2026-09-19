import { ArrowUpRight, Zap } from "lucide-react";
import { socialLinks } from "@/components/Footer";
import type { Product } from "@/data/products";

export default function ProductCard({ product: p }: { product: Product }) {
  return <article className="flex h-full flex-col overflow-hidden border border-white/10 bg-[#19191b] transition-colors hover:border-[#9b2d35]/70">
    <div className={`relative flex aspect-square items-end overflow-hidden bg-gradient-to-br ${p.tone} p-5`}>
      <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-soft-light" style={{ backgroundImage: "url(/manus-storage/marius-products_a83edb69.jpg)" }} aria-hidden="true" />
      <span className="absolute right-4 top-4 border border-white/20 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/80">{p.tag}</span>
      <div className="relative flex w-full items-end justify-between" aria-hidden="true"><span className="font-display text-8xl leading-[0.7] text-white/90">{p.letter}</span><Zap className="text-[#f4c660]" /></div>
    </div>
    <div className="flex flex-1 flex-col p-5"><p className="font-mono text-[10px] uppercase tracking-wider text-[#e78d94]">{p.category}</p><h3 className="mt-2 font-display text-2xl uppercase">{p.name}</h3><p className="mb-6 mt-2 text-sm leading-6 text-[#b7aba1]">{p.detail}</p><div className="mt-auto border-t border-white/10 pt-4"><p className="font-mono text-sm font-bold text-[#f4c660]">{p.price}</p><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Se renseigner sur ${p.name} sur Instagram (nouvel onglet)`} className="mt-4 flex items-center justify-between gap-2 border border-white/20 px-3 py-3 text-xs font-semibold hover:border-[#9b2d35] hover:bg-[#9b2d35]">Se renseigner <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a></div></div>
  </article>;
}
