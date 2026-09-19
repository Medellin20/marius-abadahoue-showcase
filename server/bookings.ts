import express, { type ErrorRequestHandler } from "express";
import { bookingLabels, bookingSchema } from "../shared/booking";

export function createBookingRouter(env: NodeJS.ProcessEnv = process.env, send: typeof fetch = fetch) {
  const router = express.Router();
  const attempts = new Map<string, { count: number; expires: number }>();
  router.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); next(); });
  router.post("/", (req, res, next) => {
    const now = Date.now();
    attempts.forEach((value, key) => { if (value.expires <= now) attempts.delete(key); });
    const key = req.ip || "unknown";
    const entry = attempts.get(key) || { count: 0, expires: now + 15 * 60_000 };
    if (entry.count >= 5 || (!attempts.has(key) && attempts.size >= 10_000)) {
      res.setHeader("Retry-After", Math.ceil((entry.expires - now) / 1000));
      res.status(429).json({ error: "Trop de tentatives. Réessayez dans 15 minutes." }); return;
    }
    entry.count++; attempts.set(key, entry); next();
  }, express.json({ limit: "12kb" }), async (req, res) => {
    const parsed = bookingSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Vérifiez les champs du formulaire.", fields: parsed.error.flatten().fieldErrors }); return;
    }
    const { RESEND_API_KEY, BOOKING_EMAIL_TO, BOOKING_EMAIL_FROM } = env;
    if (!RESEND_API_KEY || !BOOKING_EMAIL_TO || !BOOKING_EMAIL_FROM) {
      res.status(503).json({ error: "Les réservations sont momentanément indisponibles. Veuillez réessayer plus tard." }); return;
    }
    const data = parsed.data;
    const text = ["Nouvelle demande de visite — suivi coaching", "Le créneau souhaité reste à confirmer avec le client.", "", ...Object.entries(bookingLabels).map(([key, label]) => `${label} : ${key === "consent" ? "Oui" : data[key as keyof typeof data] || "Non renseigné"}`)].join("\n");
    try {
      const response = await send("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: BOOKING_EMAIL_FROM, to: [BOOKING_EMAIL_TO], reply_to: data.email, subject: "Nouvelle demande de visite coaching — Patati", text }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error("Mail provider rejected request");
      const result = await response.json() as { id?: string };
      if (!result.id) throw new Error("Missing email acknowledgement");
      res.status(201).json({ success: true });
    } catch {
      res.status(502).json({ error: "L’envoi n’a pas pu être confirmé. Réessayez dans quelques minutes. Si vous avez déjà envoyé cette demande, évitez de la répéter immédiatement." });
    }
  });
  const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
    res.status(err.status === 413 ? 413 : 400).json({ error: "Le formulaire transmis est invalide ou trop volumineux." });
  };
  router.use(handleError);
  return router;
}
