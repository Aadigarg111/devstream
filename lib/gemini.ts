const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

type GeminiMessage = {
  role: "user" | "model";
  text: string;
};

export async function generateWithGemini(systemPrompt: string, userPrompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return null;
  }

  const messages: GeminiMessage[] = [
    { role: "user", text: systemPrompt },
    { role: "model", text: "Understood. I will follow these instructions." },
    { role: "user", text: userPrompt },
  ];

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: messages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1500,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("\n")
    .trim();

  return text || null;
}
