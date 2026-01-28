import { callDeepSeekReasoner, callDeepSeekChat } from "@/lib/openrouter";
import { callGroqAI } from "@/lib/groq";
import { callCerebrasAI } from "@/lib/ai/cerebras";
import { callPublicAI } from "@/lib/ai/publicai";

export interface SmartAIOptions {
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
    modelType?: "reasoner" | "chat"; // reasoner = DeepSeek R1, chat = V3/Llama
}

/**
 * Smart AI Client - Production Ready
 * Robust fallback chain: DeepSeek → Groq → Cerebras → PublicAI
 * Ensures AI features always work even if individual providers fail.
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

    // Provider 1: DeepSeek (Primary - Best for reasoning)
    try {
        const deepSeekPromise = modelType === "reasoner"
            ? callDeepSeekReasoner(messages, { temperature, maxTokens })
            : callDeepSeekChat(messages, { temperature, maxTokens });

        const result = await Promise.race([
            deepSeekPromise,
            new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("DeepSeek Timeout")), 45000)
            )
        ]);

        console.log("✅ DeepSeek Success");
        return result;

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.warn("⚠️ DeepSeek Failed:", errorMessage);
    }

    // Provider 2: Groq (Fast - Llama 3 70B)
    try {
        const result = await Promise.race([
            callGroqAI(messages, { temperature, maxTokens, jsonMode }),
            new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("Groq Timeout")), 30000)
            )
        ]);
        console.log("✅ Groq Fallback Success");
        return result;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.warn("⚠️ Groq Failed:", errorMessage);
    }

    // Provider 3: Cerebras (Ultra-fast inference)
    try {
        const result = await Promise.race([
            callCerebrasAI(messages, { temperature, maxTokens }),
            new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("Cerebras Timeout")), 30000)
            )
        ]);
        console.log("✅ Cerebras Fallback Success");
        return result;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.warn("⚠️ Cerebras Failed:", errorMessage);
    }

    // Provider 4: PublicAI (Final fallback)
    try {
        const result = await Promise.race([
            callPublicAI(messages, { temperature, maxTokens }),
            new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("PublicAI Timeout")), 30000)
            )
        ]);
        console.log("✅ PublicAI Fallback Success");
        return result;
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ All AI Providers Failed:", errorMessage);
    }

    // All providers failed
    throw new Error("AI Service Unavailable. All providers failed. Please try again later.");
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
