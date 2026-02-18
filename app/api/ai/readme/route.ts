import { NextRequest, NextResponse } from "next/server";
import { generateWithGemini } from "@/lib/gemini";

const DEMO = "# Your Project\n\n> A brief description of your project\n\n## ✨ Features\n\n- Feature one — does something cool\n- Feature two — handles edge cases\n- Feature three — beautiful UI\n\n## 🚀 Quick Start\n\n```bash\ngit clone https://github.com/user/repo.git\ncd repo\nnpm install\nnpm run dev\n```\n\n## 🛠️ Tech Stack\n\n- **Frontend:** Next.js 14, TypeScript, Tailwind CSS\n- **Backend:** Node.js, API Routes\n- **Database:** PostgreSQL\n\n## 📝 License\n\nMIT\n\n---\n\n*Customize the sections above for your specific project!*";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await generateWithGemini(
      "Generate a professional README.md for the given project or repo. Include sections: title, description, features, quick start, tech stack, and license. Use emojis and markdown.",
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
