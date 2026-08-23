export default async function handler(req, res) {
  // Allow Framer to securely communicate with this submission route
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight safety requests from browsers automatically
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Block anything that isn't a form submission
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    // Extract the information typed into the Framer form layout fields
    const { email, phone, promoCode, consent } = req.body;

    // Basic server-side guard checks to ensure spam data isn't sneaking through
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required." });
    }
    if (!consent) {
      return res.status(400).json({ error: "Consent terms must be accepted to proceed." });
    }

    // Grab your hidden Zapier webhook link safely from Vercel's server backend environment
    const zapierUrl = process.env.ZAPIER_WEBHOOK_URL;
    if (!zapierUrl) {
      throw new Error("Server configuration error: Missing Zapier Webhook environment variable.");
    }

    // Forward the clean data safely over to Zapier out of public sight
    const zapierResponse = await fetch(zapierUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, promoCode, consent }),
    });

    if (!zapierResponse.ok) {
      throw new Error("Failed to forward data package to Zapier processing pipelines.");
    }

    // Return a perfect success response to Framer
    return res.status(200).json({ success: true, message: "Submission verified and successfully recorded!" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
