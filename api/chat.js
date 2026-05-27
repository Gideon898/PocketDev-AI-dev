export default async function handler(req, res) {

  // ONLY POST REQUESTS
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST allowed"
    });
  }

  try {

    const { messages } = req.body;

    // SAFETY CHECK
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages format"
      });
    }

    // CALL OPENROUTER
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {

          // ✅ THIS IS THE FIX (AUTH HEADER)
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "google/gemini-2.5-flash",

          messages: [
            {
              role: "system",
              content: `
You are PocketDev AI.

You are a highly intelligent coding assistant.

Rules:
- Be clear and structured
- Help with coding, debugging, SaaS, UI/UX
- Always give working code when asked
- Keep answers practical and production-ready
              `
            },

            ...messages
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

    // EXTRACT REPLY SAFELY
    const reply =
      data.choices?.[0]?.message?.content ||
      data.error?.message ||
      "No response from AI";

    return res.status(200).json({
      reply
    });

  } catch (error) {

    console.log("SERVER ERROR:", error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
