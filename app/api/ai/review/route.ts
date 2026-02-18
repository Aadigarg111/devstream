import { NextRequest, NextResponse } from "next/server";

const DEMO = "**Code Review Summary:**\n\n✅ **Good:**\n- Clean code structure\n- Proper TypeScript types\n- Good naming conventions\n\n⚠️ **Suggestions:**\n1. Add input validation\n2. Consider memoizing expensive computations\n3. Add JSDoc comments for public APIs\n4. Extract magic numbers into named constants\n\n❌ **Issues:**\n1. Missing error boundary for async operations\n2. No loading state handling\n3. Add cleanup in useEffect to prevent memory leaks\n\n**Overall: 7/10** — Solid foundation, needs minor improvements.";

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
            { role: "system", content: "You are a senior code reviewer. Review the code for quality, bugs, performance, and best practices. Use ✅ ⚠️ ❌ sections. Give a score out of 10." },
            { role: "user", content: `Review this code:\n${prompt}` },
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
