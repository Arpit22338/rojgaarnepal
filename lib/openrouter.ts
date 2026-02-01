// OpenRouter API Configuration for DeepSeek models
// Used for chat and resume builder features to reduce GROQ rate limiting
// Production-ready with improved model selection

export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// DeepSeek models available through OpenRouter - optimized for rate limit efficiency
export const DEEPSEEK_V3_MODEL = "deepseek/deepseek-chat"; // Fast, cost-effective for general chat
export const DEEPSEEK_R1_MODEL = "deepseek/deepseek-r1"; // Better reasoning for resume/complex tasks

interface OpenRouterMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OpenRouterResponse {
    id: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export async function callOpenRouterAI(
    messages: OpenRouterMessage[],
    options: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    } = {}
): Promise<string> {
    const {
        model = DEEPSEEK_V3_MODEL,
        temperature = 0.7,
        maxTokens = 4096,
    } = options;

    if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key not configured");
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.NEXTAUTH_URL || "http://localhost:3000",
            "X-Title": "RojgaarNepal",
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("OpenRouter API error:", response.status, error);
        throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0]?.message?.content || "";
}

// Convenience function for chat with DeepSeek V3
export async function callDeepSeekChat(
    messages: OpenRouterMessage[],
    options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    return callOpenRouterAI(messages, { ...options, model: DEEPSEEK_V3_MODEL });
}

// Convenience function for resume/reasoning with DeepSeek R1
export async function callDeepSeekReasoner(
    messages: OpenRouterMessage[],
    options: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
    return callOpenRouterAI(messages, { ...options, model: DEEPSEEK_R1_MODEL });
}
