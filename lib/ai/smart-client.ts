import { callDeepSeekReasoner, callDeepSeekChat } from "@/lib/openrouter";
import { callGroqAI } from "@/lib/groq";

export interface SmartAIOptions {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
    modelType?: "reasoner" | "chat"; // reasoner = DeepSeek R1, chat = V3/Llama
}

/**
 * Smart AI Client
 * Prioritizes DeepSeek R1 (OpenRouter) for high-quality reasoning.
 * Falls back to Groq (Llama 3 70B) for speed/redundancy if DeepSeek fails/rate-limits.
 */
export async function smartAICall(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
    options: SmartAIOptions = {}
): Promise<string> {
    const {
        temperature = 0.7,
        maxTokens = 4096,
        jsonMode = false,
        modelType = "chat"
    } = options;

    console.log(`🧠 SmartAI Request: [${modelType}] with ${messages.length} messages`);

    // 1. Try DeepSeek (R1 or V3)
    try {
        const deepSeekPromise = modelType === "reasoner"
            ? callDeepSeekReasoner(messages, { temperature, maxTokens })
            : callDeepSeekChat(messages, { temperature, maxTokens });

        // Timeout DeepSeek after 45s (it can be slow)
        const result = await Promise.race([
            deepSeekPromise,
            new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("DeepSeek Timeout")), 45000)
            )
        ]);

        console.log("✅ DeepSeek Success");
        return result;

    } catch (error: any) {
        console.warn("⚠️ DeepSeek Failed/Timeout, falling back to Groq:", error.message);

        // 2. Fallback to Groq (Llama 3 70B)
        // Llama 3 70B is an excellent fallback for R1
        try {
            const result = await callGroqAI(messages, {
                temperature,
                maxTokens,
                jsonMode
            });
            console.log("✅ Groq Fallback Success");
            return result;
        } catch (groqError: any) {
            console.error("❌ All AI Providers Failed:", groqError.message);
            throw new Error("AI Service Unavailable. Please try again later.");
        }
    }
}

/**
 * Helper to parse JSON from AI response, handling Markdown code blocks
 */
export function parseAIJSON<T>(response: string): T {
    try {
        // 1. Try direct parse
        return JSON.parse(response);
    } catch {
        try {
            // 2. Try extracting from ```json block
            const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
                return JSON.parse(jsonMatch[1]);
            }

            // 3. Try finding first { and last }
            const start = response.indexOf('{');
            const end = response.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                return JSON.parse(response.substring(start, end + 1));
            }

            throw new Error("No JSON found");
        } catch (e) {
            console.error("Failed to parse AI JSON:", response.substring(0, 100) + "...");
            throw new Error("Invalid response format");
        }
    }
}
