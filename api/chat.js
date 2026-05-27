export default async function handler(req, res) {

  if (req.method === "GET") {
    return res.status(200).json({
      key: process.env.OPENROUTER_API_KEY || "MISSING"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST allowed"
    });
  }

  try {

    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages format"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
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

    return res.status(200).json({
      reply:
        data.choices?.[0]?.message?.content ||
        data.error?.message ||
        "No response from AI"
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Server error"
    });
  }
}
