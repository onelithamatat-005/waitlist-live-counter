export default async function handler(req, res) {
  // Clear the path for Framer to securely communicate with this submission route
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Automatically pass preflight check requests from browsers
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Block anything that isn't a form submission
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const { email, phone, promoCode, consent } = req.body || {};

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    // 1. Direct secure handshake to log the row inside your Supabase table instantly
    const supabaseResponse = await fetch("https://supabase.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": "sb_publishable_HyuEG7LFNed1oTaQ7iAUSQ_1z-ULHC3",
        "Authorization": "Bearer sb_publishable_HyuEG7LFNed1oTaQ7iAUSQ_1z-ULHC3",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ 
        email: String(email), 
        phone: phone ? String(phone) : "", 
        promo_code: promoCode ? String(promoCode) : "", 
        consent: !!consent 
      })
    });

    if (!supabaseResponse.ok) {
      console.error("Supabase error status:", supabaseResponse.status);
      throw new Error("Database logging failed.");
    }

    // 2. Trigger your existing Zapier spreadsheet tracking pipeline cleanly in the background
    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (zapierUrl) {
      await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, promoCode, consent })
      });
    }

    return res.status(200).json({ success: true, message: "Logged successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
