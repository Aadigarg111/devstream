import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

const DEMO = "**Line-by-line breakdown:**\n\n1. The function accepts input parameters and validates them\n2. It processes the data through the main logic pipeline\n3. Error handling catches edge cases\n4. The result is returned in the expected format\n\n**Key concepts:**\n- Clean separation of concerns\n- Proper error handling\n- Type safety with TypeScript\n\n**Time complexity:** O(n) where n is the input size\n**Space complexity:** O(1) additional space";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  try {
    const response = await generateWithGemini(
      "You are a code explainer. Explain the given code line by line, covering key concepts, complexity, and potential issues. Use markdown.",
      `Explain this code:\n${prompt}`,
    );

    if (response) {
      return NextResponse.json({ response });
    }
  } catch {
    // fallback
  }

  return NextResponse.json({ response: DEMO });
}
