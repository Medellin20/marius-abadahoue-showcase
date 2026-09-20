import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { bookingSchema, goals, levels, timeSlots, todayInBenin } from "@shared/booking";

const inputClass = "mt-2 w-full rounded-sm border border-white/25 bg-[#171619] px-3 py-3 text-base text-[#fff8f0] focus:border-[#f4c660] focus:outline-none focus:ring-1 focus:ring-[#f4c660]";
export default function BookingForm() {
  const [pending, setPending] = useState(false);
  const [consent, setConsent] = useState(false);
  const submitting = useRef(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<Record<string, string[] | undefined>>({});
  const fieldError = (name: string) => fields[name] ? <span id={`${name}-error`} className="mt-1 block text-sm text-[#f4c660]">{fields[name]?.[0]}</span> : null;
  const attrs = (name: string) => ({ name, id: name, "aria-invalid": !!fields[name], "aria-describedby": fields[name] ? `${name}-error` : undefined });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || !consent) return;
    const values = new FormData(event.currentTarget);
    const parsed = bookingSchema.safeParse({ ...Object.fromEntries(values), consent: values.get("consent") === "on" });
    setError(""); setFields({});
    if (!parsed.success) {
      setFields(parsed.error.flatten().fieldErrors);
      setError("Vérifiez les champs indiqués avant l’envoi.");
      const first = parsed.error.issues[0]?.path[0];
      if (first) document.getElementById(String(first))?.focus();
      return;
    }
    submitting.current = true; setPending(true);
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(20_000) });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setFields(result.fields || {});
        throw new Error(result.error || "L’envoi a échoué. Veuillez réessayer.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error && err.name === "Error" ? err.message : "L’envoi n’a pas pu être confirmé. Vérifiez votre connexion et réessayez dans quelques minutes.");
    } finally { submitting.current = false; setPending(false); }
  }
  return <section id="reservation" className="scroll-mt-24 bg-[#252023] py-20 text-[#fff8f0] lg:py-28">
    <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
      <div><p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#f4c660]">Votre suivi coaching</p><h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Un premier pas.<br />Un vrai suivi.</h2><p className="mt-6 max-w-md leading-7 text-[#d6cbc2]">Réservez une première visite pour échanger avec le coach, préciser votre objectif et préparer un accompagnement adapté à votre rythme.</p><p className="mt-5 max-w-md text-sm leading-6 text-[#d6cbc2]">Après l’envoi, le coach reçoit votre demande par e-mail et vous recontacte pour confirmer la date et l’heure. Tous les créneaux sont à l’heure du Bénin.</p></div>
      {sent ? <div role="status" className="self-start border border-[#f4c660]/40 bg-[#171619] p-8"><CheckCircle2 className="mb-4 h-8 w-8 text-[#f4c660]" /><h3 className="font-display text-3xl uppercase">Demande transmise</h3><p className="mt-4 leading-7 text-[#d6cbc2]">Le coach a été averti de votre demande. Il vous recontactera pour confirmer votre visite et préparer votre suivi.</p><p className="mt-3 text-sm text-[#d6cbc2]">Votre rendez-vous sera confirmé lors de cet échange.</p></div> : <form onSubmit={submit} className="manus-no-record min-w-0" aria-busy={pending}>
        <p className="mb-6 text-sm text-[#d6cbc2]">Les champs marqués * sont obligatoires. Pour un mineur, la visite se prépare avec un représentant légal.</p>
        <fieldset disabled={pending} className="grid gap-5 sm:grid-cols-2 disabled:opacity-70">
          <legend className="sr-only">Informations pour le suivi coaching</legend>
          <label className="text-sm" htmlFor="name">Nom et prénom *<input {...attrs("name")} autoComplete="name" required minLength={2} maxLength={120} className={inputClass} />{fieldError("name")}</label>
          <label className="text-sm" htmlFor="age">Âge *<input {...attrs("age")} type="number" min={1} max={100} required className={inputClass} />{fieldError("age")}</label>
          <label className="text-sm" htmlFor="email">E-mail *<input {...attrs("email")} type="email" autoComplete="email" maxLength={254} required className={inputClass} />{fieldError("email")}</label>
          <label className="text-sm" htmlFor="phone">Téléphone / WhatsApp *<input {...attrs("phone")} type="tel" autoComplete="tel" placeholder="+229 …" maxLength={25} required className={inputClass} />{fieldError("phone")}</label>
          <label className="text-sm sm:col-span-2" htmlFor="city">Ville / quartier *<input {...attrs("city")} autoComplete="address-level2" required minLength={2} maxLength={120} className={inputClass} />{fieldError("city")}</label>
          <label className="text-sm" htmlFor="goal">Objectif principal *<select {...attrs("goal")} required defaultValue="" className={inputClass}><option value="" disabled>Choisir un objectif</option>{goals.map(item => <option key={item}>{item}</option>)}</select>{fieldError("goal")}</label>
          <label className="text-sm" htmlFor="level">Niveau sportif *<select {...attrs("level")} required defaultValue="" className={inputClass}><option value="" disabled>Choisir votre niveau</option>{levels.map(item => <option key={item}>{item}</option>)}</select>{fieldError("level")}</label>
          <label className="text-sm" htmlFor="date">Date souhaitée pour la visite *<input {...attrs("date")} type="date" required min={todayInBenin()} className={`${inputClass} [color-scheme:dark]`} />{fieldError("date")}</label>
          <label className="text-sm" htmlFor="timeSlot">Créneau souhaité *<select {...attrs("timeSlot")} required defaultValue="" className={inputClass}><option value="" disabled>Choisir un créneau</option>{timeSlots.map(item => <option key={item}>{item}</option>)}</select>{fieldError("timeSlot")}</label>
          <label className="text-sm sm:col-span-2" htmlFor="availability">Disponibilités pour le suivi régulier *<textarea {...attrs("availability")} required minLength={2} maxLength={500} rows={2} placeholder="Ex. : lundi et mercredi après 18 h, deux séances par semaine." className={inputClass} />{fieldError("availability")}</label>
          <label className="text-sm sm:col-span-2" htmlFor="notes">Précisions (facultatif)<textarea {...attrs("notes")} maxLength={1500} rows={3} placeholder="Vos attentes, vos habitudes sportives ou vos questions pour le coach." className={inputClass} /><span className="mt-2 block text-xs text-[#d6cbc2]">Les informations médicales pourront être abordées directement avec le coach lors de la visite.</span>{fieldError("notes")}</label>
          <div className="hidden" aria-hidden="true"><label>Site web<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <div className="sm:col-span-2"><label className="flex items-start gap-3 text-sm leading-6"><input {...attrs("consent")} type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} required className="mt-1 h-4 w-4 shrink-0 accent-[#9b2d35]" />J’accepte que ces informations soient transmises par e-mail à l’équipe coaching pour traiter ma demande et me recontacter.</label>{fieldError("consent")}</div>
          {error && <p role="alert" className="border border-[#f4c660]/50 p-3 text-sm text-[#f4c660] sm:col-span-2">{error}</p>}
          <button type="submit" disabled={!consent || pending} className="flex items-center justify-center gap-3 bg-[#9b2d35] px-5 py-4 font-mono text-xs font-bold uppercase tracking-wider enabled:hover:bg-[#bc3943] disabled:cursor-not-allowed disabled:bg-[#51494c] disabled:text-[#c9bfb7] sm:col-span-2">{pending ? <><Loader2 className="h-4 w-4 animate-spin" />Envoi en cours…</> : <>Demander ma visite coaching <ArrowRight className="h-4 w-4" /></>}</button>
        </fieldset>
      </form>}
    </div>
  </section>;
}
