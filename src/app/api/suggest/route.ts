import { NextResponse } from "next/server";
import { getAISuggestion } from "@/utils/AiSuggest";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const suggestion = await getAISuggestion(prompt);
    console.log("AI Suggestion:", suggestion);
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error generating suggestion:", error);
    return NextResponse.json(
      { error: "Error generating suggestion" },
      { status: 500 }
    );
  }
}
