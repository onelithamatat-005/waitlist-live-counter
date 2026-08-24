export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // This will catch exactly what Framer is broadcasting to Vercel
  const receivedData = req.body;

  return res.status(200).json({
    message: "Radar active!",
    dataTypeDetected: typeof receivedData,
    whatVercelReceived: receivedData,
    keysFound: receivedData ? Object.keys(receivedData) : "none"
  });
}
