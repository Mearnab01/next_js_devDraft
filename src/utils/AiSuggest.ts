import { GoogleGenAI } from "@google/genai";

//const model = "gemini-2.5-pro-preview-05-06";
const model = "models/gemini-2.5-pro-exp-03-25";

export async function getAISuggestion(prompt: string): Promise<string> {
  try {
    const adjustedPrompt = `Provide an alternative implementation for the following code, focusing on more efficient, concise, or modern solutions. Do not explain the changes, just provide the alternative code suggestion. Here's the code snippet: ${prompt}`;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const tools = [{ codeExecution: {} }];
    const config = {
      tools,
      responseMimeType: "text/plain",
    };

    const contents = [
      {
        role: "user",
        parts: [{ text: adjustedPrompt }],
      },
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let suggestion = "";
    for await (const chunk of response) {
      if (chunk?.candidates?.[0]?.content?.parts?.[0]?.text) {
        suggestion += chunk.candidates[0].content.parts[0].text;
      }
    }

    return suggestion || "No suggestion available.";
  } catch (error: any) {
    if (error.code === 429) {
      console.warn("Rate limit hit. Retrying in 41 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 41000)); // Wait 41 seconds
      return getAISuggestion(prompt); // Retry the request
    }
    console.error("[getAISuggestion] Error:", error.message);
    return "Error generating suggestion.";
  }
}
