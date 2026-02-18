import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

const DEMO = "Based on your changes, here are commit message suggestions:\n\n```\nfeat: add user authentication with GitHub OAuth\n```\n```\nfix: resolve memory leak in data fetching hook\n```\n```\nrefactor: extract API calls into custom hooks\n```\n\n**Convention:** Conventional Commits (type: description)\n**Types:** feat, fix, docs, style, refactor, test, chore";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await generateWithGemini(
      "Generate conventional commit messages for the given diff or description. Provide 3 options with different types (feat/fix/refactor/etc). Use markdown code blocks.",
      prompt,
    );

    if (response) {
      return NextResponse.json({ response });
    }
  } catch {
    // fallback
  }

  return NextResponse.json({ response: DEMO });
}
