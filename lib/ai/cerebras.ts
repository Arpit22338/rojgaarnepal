/**
 * Cerebras AI Client
 * Fast inference with Cerebras models - up to 2000 tokens/second
 * API Docs: https://inference-docs.cerebras.ai/
 * 
 * Available models:
 * - llama-4-scout-17b-16e-instruct (Fast Llama 4 Scout)
 * - llama3.1-8b (Fast, lightweight)
 * - llama3.1-70b (More capable)
 */

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY || "";

interface CerebrasOptions {
    temperature?: number;
    maxTokens?: number;
}

export async function callCerebrasAI(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
    options: CerebrasOptions = {}
): Promise<string> {
    const { temperature = 0.7, maxTokens = 4096 } = options;

    if (!CEREBRAS_API_KEY) {
        throw new Error("Cerebras API key not configured");
    }

    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${CEREBRAS_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3.1-70b", // Best quality Llama model on Cerebras
            messages,
            temperature,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Cerebras API Error:", error);
        throw new Error(`Cerebras API failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}
