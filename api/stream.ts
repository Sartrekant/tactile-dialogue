import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { readContent } from "./_content";
import { DEFAULTS } from "../src/lib/content-types";


const ALLOWED_ORIGINS = [
  "https://landsvig.com",
  "https://www.landsvig.com",
  "http://localhost:8080",
  "http://localhost:5173",
];

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const { messages } = await req.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "messages er påkrævet" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const content = await readContent().catch(() => DEFAULTS);
  const systemPrompt = content.settings.chatPrompt || DEFAULTS.settings.chatPrompt;

  const result = streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemPrompt,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
