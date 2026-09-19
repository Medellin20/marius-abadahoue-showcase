import { z } from "zod";

export const goals = ["Prise de muscle", "Perte de poids", "Remise en forme", "Préparation compétition", "Autre"] as const;
export const levels = ["Débutant", "Intermédiaire", "Confirmé"] as const;
export const timeSlots = ["Matin (8 h – 12 h)", "Après-midi (12 h – 17 h)", "Soir (17 h – 20 h)"] as const;
export const todayInBenin = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Porto-Novo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const shortText = z.string().trim().min(2, "Indiquez au moins 2 caractères.").max(120, "120 caractères maximum.");
export const bookingSchema = z.object({
  name: shortText,
  email: z.string().trim().email("Adresse e-mail invalide.").max(254),
  phone: z.string().trim().regex(/^\+?[\d\s().-]{8,25}$/, "Numéro de téléphone invalide.").refine(value => value.replace(/\D/g, "").length >= 8, "Numéro de téléphone invalide."),
  city: shortText,
  age: z.coerce.number().int().min(1, "Indiquez un âge valide.").max(100),
  goal: z.enum(goals),
  level: z.enum(levels),
  availability: z.string().trim().min(2, "Précisez vos disponibilités pour le suivi.").max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value && value >= todayInBenin();
  }, "Choisissez une date valide, aujourd’hui ou plus tard."),
  timeSlot: z.enum(timeSlots),
  notes: z.string().trim().max(1500).default(""),
  consent: z.literal(true, { error: "Votre accord est nécessaire pour transmettre la demande." }),
  website: z.string().max(0).optional(),
});
export type Booking = z.infer<typeof bookingSchema>;
export const bookingLabels: Record<keyof Omit<Booking, "website">, string> = {
  name: "Nom et prénom", email: "E-mail", phone: "Téléphone / WhatsApp", city: "Ville / quartier", age: "Âge",
  goal: "Objectif", level: "Niveau sportif", availability: "Disponibilités pour le suivi", date: "Date souhaitée",
  timeSlot: "Créneau souhaité (heure du Bénin)", notes: "Précisions", consent: "Accord pour être recontacté",
};
