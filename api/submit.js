module.exports = async function handler(req, res) {
  // Allow Framer to securely communicate with this submission route
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { email, phone, promoCode, consent } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }

    // Safely reads your secret environment variable in standard CommonJS format
    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (!zapierUrl) {
      throw new Error("Missing Zapier Webhook environment variable.");
    }

    const zapierResponse = await fetch(zapierUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, promoCode, consent }),
    });

    if (!zapierResponse.ok) {
      throw new Error("Failed to forward data to Zapier.");
    }

    return res.status(200).json({ success: true, message: "Submission verified!" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
