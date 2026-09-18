const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * openrouter/free automatically selects an available free model that supports
 * the request. Set OPENROUTER_MODEL=openrouter/auto for quality-based routing
 * across OpenRouter's paid model pool.
 */
export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL?.trim() || "openrouter/free";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  model?: string;
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

export interface OpenRouterOptions {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  sessionId?: string;
}

export async function callOpenRouterAI(
  messages: OpenRouterMessage[],
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const {
    temperature = 0.7,
    maxTokens = 4096,
    jsonMode = false,
    sessionId,
  } = options;

  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXTAUTH_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://www.rojgaarnepal.com",
      "X-Title": "RojgaarNepal",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      ...(sessionId ? { session_id: sessionId } : {}),
    }),
    signal: AbortSignal.timeout(60_000),
  });

  const data = (await response.json().catch(() => ({}))) as OpenRouterResponse;

  if (!response.ok) {
    const detail = data.error?.message || response.statusText || "Unknown error";
    throw new Error(`OpenRouter request failed (${response.status}): ${detail}`);
  }

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("OpenRouter returned an empty response");
  }

  console.info(`OpenRouter completed with ${data.model || OPENROUTER_MODEL}`);
  return content;
}
