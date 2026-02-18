import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

const DEMO = "**Code Review Summary:**\n\n✅ **Good:**\n- Clean code structure\n- Proper TypeScript types\n- Good naming conventions\n\n⚠️ **Suggestions:**\n1. Add input validation\n2. Consider memoizing expensive computations\n3. Add JSDoc comments for public APIs\n4. Extract magic numbers into named constants\n\n❌ **Issues:**\n1. Missing error boundary for async operations\n2. No loading state handling\n3. Add cleanup in useEffect to prevent memory leaks\n\n**Overall: 7/10** — Solid foundation, needs minor improvements.";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await generateWithGemini(
      "You are a senior code reviewer. Review the code for quality, bugs, performance, and best practices. Use ✅ ⚠️ ❌ sections. Give a score out of 10.",
      `Review this code:\n${prompt}`,
    );

    if (response) {
      return NextResponse.json({ response });
    }
  } catch {
    // fallback
  }

  return NextResponse.json({ response: DEMO });
}
