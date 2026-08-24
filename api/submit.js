export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, options");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "options") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

  try {
    const { email, phone, promoCode, consent } = req.body || {};

    // 1. Instantly forward a secure row creation packet to your Supabase database table
    const supabaseResponse = await fetch("https://poahftwazktywaiicsrg.supabase.co/rest/v1/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "sb_publishable_HyuEG7LFNed1oTaQ7iAUSQ_1z-ULHC3",
        "Authorization": "Bearer sb_publishable_HyuEG7LFNed1oTaQ7iAUSQ_1z-ULHC3",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ email, phone, promo_code: promoCode, consent })
    });

    if (!supabaseResponse.ok) throw new Error("Database logging failed");

    // 2. Trigger your existing Zapier tracking chain cleanly in the background
    if (process.env.ZAPIER_WEBHOOK_URL) {
      await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, promoCode, consent })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
