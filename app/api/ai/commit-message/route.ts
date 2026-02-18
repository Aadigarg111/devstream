import { NextRequest, NextResponse } from "next/server";

const DEMO = "Based on your changes, here are commit message suggestions:\n\n```\nfeat: add user authentication with GitHub OAuth\n```\n```\nfix: resolve memory leak in data fetching hook\n```\n```\nrefactor: extract API calls into custom hooks\n```\n\n**Convention:** Conventional Commits (type: description)\n**Types:** feat, fix, docs, style, refactor, test, chore";

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
            { role: "system", content: "Generate conventional commit messages for the given diff or description. Provide 3 options with different types (feat/fix/refactor/etc). Use markdown code blocks." },
            { role: "user", content: prompt },
          ],
          max_tokens: 500,
        }),
      });
      const data = await res.json();
      return NextResponse.json({ response: data.choices[0].message.content });
    } catch { /* fallback */ }
  }

  return NextResponse.json({ response: DEMO });
}
