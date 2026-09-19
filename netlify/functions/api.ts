import express from "express";
import serverless from "serverless-http";
import { createBookingRouter } from "../../server/bookings";
import { createStorageRouter } from "../../server/storage";

const app = express();
app.disable("x-powered-by");
const router = express.Router();
router.use("/api/bookings", createBookingRouter());
router.use("/manus-storage", createStorageRouter());
router.use((_req, res) => {
  res.status(404).json({ error: "Route introuvable." });
});

// Support both rewritten URLs and direct function invocations.
app.use("/.netlify/functions/api", router);
app.use(router);

export const handler = serverless(app, {
  request(req: express.Request, event: { headers?: Record<string, string | undefined> }) {
    // Netlify supplies this connection header; never trust arbitrary X-Forwarded-For.
    const ip = event.headers?.["x-nf-client-connection-ip"];
    if (ip) Object.defineProperty(req, "ip", { value: ip, configurable: true });
  },
});
