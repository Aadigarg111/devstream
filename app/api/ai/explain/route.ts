import { NextRequest, NextResponse } from "next/server";

const DEMO = "**Line-by-line breakdown:**\n\n1. The function accepts input parameters and validates them\n2. It processes the data through the main logic pipeline\n3. Error handling catches edge cases\n4. The result is returned in the expected format\n\n**Key concepts:**\n- Clean separation of concerns\n- Proper error handling\n- Type safety with TypeScript\n\n**Time complexity:** O(n) where n is the input size\n**Space complexity:** O(1) additional space";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a code explainer. Explain the given code line by line, covering key concepts, complexity, and potential issues. Use markdown." },
            { role: "user", content: `Explain this code:\n${prompt}` },
          ],
          max_tokens: 1000,
        }),
      });
      const data = await res.json();
      return NextResponse.json({ response: data.choices[0].message.content });
    } catch { /* fallback */ }
  }

  return NextResponse.json({ response: DEMO });
}
