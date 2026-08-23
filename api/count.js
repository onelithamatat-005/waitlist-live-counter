export default async function handler(req, res) {
  // 1. Paste your published Google Sheets CSV link between these quotes:
  const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSTcPbSb0VHH-OZ29DvT_T3RPStfANu87u3GpO4CwUAPw25jp3-RGNL_Eo8zgDsb4-aHSFEGJaww3lM/pub?gid=0&single=true&output=csv";

  // Standard CORS headers allowing Framer to read your Vercel data securely
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Google Sheet unavailable");
    
    const csvText = await response.text();

    // Split rows and drop empty entries
    const rows = csvText.split("\n").filter(row => row.trim() !== "");
    
    // Subtracts 1 row for your column header (e.g., Name, Email, Timestamp)
    const totalCount = rows.length > 0 ? rows.length - 1 : 0;

    // Return the response object structure Framer expects
    return res.status(200).json({ count: totalCount });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
