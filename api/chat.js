export default async function handler(req, res){

  // ONLY POST
  if(req.method !== "POST"){

    return res.status(405).json({
      error:"Only POST allowed"
    });

  }

  try{

    const { messages } =
    req.body;

    const response =
    await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {

        method:"POST",

        headers:{

          "Authorization":
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
          "application/json"

        },

        body: JSON.stringify({

          model:
          "google/gemini-2.5-flash",

          messages:[

            {

              role:"system",

              content:`

You are PocketDev AI.

You are an advanced AI assistant
focused on:

- coding
- debugging
- app development
- startups
- UI/UX
- SaaS products
- mobile-first design
- automation

Rules:

1. Give clean modern solutions.
2. Prefer mobile-friendly code.
3. Never expose API keys.
4. Explain clearly.
5. Help users ship real products.
6. Think step-by-step.
7. Format code professionally.
8. Be smart and concise.

`

            },

            ...messages

          ]

        })

      }
    );

    const data =
    await response.json();

    console.log(data);

    res.status(200).json({

      reply:

      data.choices?.[0]
      ?.message?.content ||

      data.error?.message ||

      "No response"

    });

  }

  catch(error){

    console.log(error);

    res.status(500).json({
      error:"Server error"
    });

  }

}
