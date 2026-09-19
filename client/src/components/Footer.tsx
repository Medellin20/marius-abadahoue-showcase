import { ArrowRight, ArrowUp, Clock3, Instagram, MapPin, Music2 } from "lucide-react";

export const socialLinks = {
  instagram: "https://www.instagram.com/championpatati/",
  tiktok: "https://www.tiktok.com/@patati3107",
};
const linkClass = "inline-flex items-center gap-2 py-2 text-sm text-[#c9bfb7] transition-colors hover:text-[#f4c660] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c660]";
const buttonClass = "inline-flex items-center justify-center gap-3 border border-white/20 px-4 py-3 text-sm font-semibold transition-colors hover:border-[#f4c660] hover:text-[#f4c660] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c660]";

export default function Footer() {
  return <footer className="border-t border-white/10 bg-[#111113] text-[#f4eee5]">
    <div className="container">
      <div className="flex flex-col gap-6 border-b border-white/15 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#f4c660]">Votre prochain objectif commence ici</p><h2 className="font-display text-3xl uppercase sm:text-4xl">Prêt à passer à l’action ?</h2></div>
        <a href="/#reservation" className={`${buttonClass} self-start border-[#9b2d35] bg-[#9b2d35] text-white hover:bg-[#b33741] hover:text-white sm:self-auto`}>Réserver une visite coaching <ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
      </div>
      <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_1fr_1fr] lg:gap-12">
        <div>
          <a href="/#top" aria-label="Patati — retour à l’accueil" className="inline-flex items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f4c660]"><span aria-hidden="true" className="flex h-11 w-11 items-center justify-center bg-[#9b2d35] font-display text-2xl italic">P</span><span><span className="block font-display text-2xl uppercase tracking-wider">Patati Patata</span><span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-[#b7aba1]">Marius Abadahoué</span></span></a>
          <p className="mt-5 max-w-xs text-sm leading-7 text-[#b7aba1]">La passion du bodybuilding, la discipline au quotidien et l’envie de vous accompagner vers votre prochain objectif.</p>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#f4c660]">Cococodji · Bénin</p>
        </div>
        <nav aria-label="Navigation du pied de page"><h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.15em]">Explorer</h3><ul className="space-y-1">{[["Le champion", "champion"], ["Le palmarès", "palmares"], ["La salle de gym", "salle"], ["Le catalogue", "catalogue"], ["Suivi coaching", "reservation"]].map(([label, id]) => <li key={id}><a className={linkClass} href={id === "catalogue" ? "/catalogue" : `/#${id}`}>{label}</a></li>)}</ul></nav>
        <div><h3 className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.15em]">Rendez-vous à la salle</h3><address className="not-italic"><p className="flex items-start gap-3 text-sm leading-6 text-[#c9bfb7]"><MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#f4c660]" /><span>Zone de Cococodji, Bénin<br /><span className="font-mono text-xs">F62W+389</span></span></p></address><a href="https://www.google.com/maps/search/?api=1&query=F62W%2B389%20Cococodji%20Benin" target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-2`}>Voir sur la carte <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></a><p className="mt-4 flex items-start gap-3 text-sm leading-6 text-[#b7aba1]"><Clock3 aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[#f4c660]" /><span>Horaires à confirmer sur place ou via les réseaux officiels.</span></p></div>
        <div><h3 className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.15em]">Gardons le contact</h3><p className="mb-5 text-sm leading-7 text-[#b7aba1]">Actualités, entraînements ou renseignements : retrouvez Patati sur ses comptes officiels.</p><div className="flex flex-col items-stretch gap-3"><a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={buttonClass}><Instagram aria-hidden="true" className="h-4 w-4" />Instagram <span className="sr-only">@championpatati — nouvel onglet</span><ArrowRight aria-hidden="true" className="ml-auto h-4 w-4" /></a><a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className={buttonClass}><Music2 aria-hidden="true" className="h-4 w-4" />TikTok <span className="sr-only">@patati3107 — nouvel onglet</span><ArrowRight aria-hidden="true" className="ml-auto h-4 w-4" /></a></div></div>
      </div>
      <div className="flex flex-col gap-4 border-t border-white/15 py-6 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-6 text-[#b7aba1]">© {new Date().getFullYear()} Marius Abadahoué · Patati Patata. Tous droits réservés.</p><a href="#top" className={linkClass}>Retour en haut <ArrowUp aria-hidden="true" className="h-4 w-4" /></a></div>
    </div>
  </footer>;
}
