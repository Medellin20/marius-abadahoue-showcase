import { Router } from "express";

// Only the existing public showcase images can be requested through this proxy.
const publicImages = new Set(["marius-gym_6bf1b7f6.jpg", "marius-products_a83edb69.jpg"]);
export function createStorageRouter(env: NodeJS.ProcessEnv = process.env, send: typeof fetch = fetch) {
  const router = Router();
  router.get("/:key", async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    if (!publicImages.has(req.params.key)) {
      res.status(404).json({ error: "Image introuvable." }); return;
    }
    const base = env.BUILT_IN_FORGE_API_URL;
    const key = env.BUILT_IN_FORGE_API_KEY;
    if (!base || !key) {
      res.status(503).json({ error: "Stockage des images non configuré." }); return;
    }
    try {
      const url = new URL("v1/storage/presign/get", `${base.replace(/\/+$/, "")}/`);
      url.searchParams.set("path", req.params.key);
      const response = await send(url, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(10_000) });
      if (!response.ok) throw new Error("Storage error");
      const body = await response.json() as { url?: string };
      const imageUrl = new URL(body.url || "");
      if (imageUrl.protocol !== "https:") throw new Error("Invalid image URL");
      res.redirect(302, imageUrl.href);
    } catch {
      res.status(502).json({ error: "Image momentanément indisponible." });
    }
  });
  return router;
}
