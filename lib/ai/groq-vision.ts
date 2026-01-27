// Groq Vision API - Face Detection & Image Analysis
// Uses Llama 4 Scout for face verification and content moderation

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_KEY_2 = process.env.GROQ_API_KEY_2 || "";
const GROQ_VISION_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Fallback model if Llama 4 Scout is unavailable
const GROQ_VISION_FALLBACK_MODEL = "llama-3.2-90b-vision-preview";

export interface FaceVerifyResult {
    status: "VERIFIED" | "REJECTED";
    reason: string;
    confidence: number;
    details?: {
        hasFace: boolean;
        isProfessional: boolean;
        isAppropriate: boolean;
    };
}

// Key rotation state
let currentKeyIndex = 0;
const GROQ_KEYS = [GROQ_API_KEY, GROQ_API_KEY_2].filter(k => k !== "");

async function callGroqVisionWithKey(
    apiKey: string,
    imageBase64: string,
    prompt: string,
    model: string = GROQ_VISION_MODEL
): Promise<{ success: boolean; data?: string; isRateLimit?: boolean; error?: string }> {
    try {
        // Validate base64 image
        const imageUrl = imageBase64.startsWith("data:")
            ? imageBase64
            : `data:image/jpeg;base64,${imageBase64}`;

        const response = await fetch(GROQ_VISION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: imageUrl } }
                        ]
                    }
                ],
                temperature: 0.3,
                max_tokens: 500,
            }),
        });

        if (response.status === 429) {
            return { success: false, isRateLimit: true, error: "Rate limit exceeded" };
        }

        if (!response.ok) {
            const error = await response.text();
            return { success: false, error: `Groq Vision API error: ${response.status} - ${error}` };
        }

        const data = await response.json();
        return { success: true, data: data.choices[0]?.message?.content || "" };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// Main face verification function with key rotation
export async function verifyProfilePhoto(imageBase64: string): Promise<FaceVerifyResult> {
    if (GROQ_KEYS.length === 0) {
        throw new Error("GROQ_VISION_NO_KEYS");
    }

    const prompt = `Analyze this profile photo for a professional job platform.

Check for:
1. Is there a clear, recognizable human face? (The photo MUST contain exactly ONE human face)
2. Is the person appropriately dressed? (No nudity, shirtless, or inappropriate attire)
3. Is the photo suitable for a professional profile? (Well-lit, clear, appropriate background)

Respond with ONLY this JSON format, no additional text:
{
  "status": "VERIFIED" or "REJECTED",
  "reason": "Brief explanation",
  "confidence": 0.0 to 1.0,
  "details": {
    "hasFace": true/false,
    "isProfessional": true/false,
    "isAppropriate": true/false
  }
}

IMPORTANT: 
- REJECT if no clear face is visible
- REJECT if inappropriate content
- REJECT if image quality is too poor to verify identity
- VERIFY only if all criteria are met`;

    // Try primary key first
    let result = await callGroqVisionWithKey(GROQ_KEYS[currentKeyIndex], imageBase64, prompt);

    // Rotate on rate limit
    if (result.isRateLimit && GROQ_KEYS.length > 1) {
        const nextIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
        console.log(`Groq Vision rate limit, rotating to key ${nextIndex + 1}`);
        result = await callGroqVisionWithKey(GROQ_KEYS[nextIndex], imageBase64, prompt);

        if (result.success) {
            currentKeyIndex = nextIndex;
        }
    }

    // Try fallback model if primary model fails
    if (!result.success && !result.isRateLimit) {
        console.log("Trying fallback vision model");
        result = await callGroqVisionWithKey(
            GROQ_KEYS[currentKeyIndex],
            imageBase64,
            prompt,
            GROQ_VISION_FALLBACK_MODEL
        );
    }

    if (!result.success) {
        throw new Error(result.isRateLimit ? "GROQ_VISION_RATE_LIMIT" : result.error);
    }

    // Parse response
    try {
        // Extract JSON from response (handle potential markdown wrapping)
        let jsonStr = result.data!;
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        const parsed = JSON.parse(jsonStr);

        return {
            status: parsed.status === "VERIFIED" ? "VERIFIED" : "REJECTED",
            reason: parsed.reason || (parsed.status === "VERIFIED" ? "Face verified" : "Verification failed"),
            confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.8,
            details: {
                hasFace: parsed.details?.hasFace ?? false,
                isProfessional: parsed.details?.isProfessional ?? false,
                isAppropriate: parsed.details?.isAppropriate ?? false,
            }
        };
    } catch {
        // If we can't parse, assume rejection for safety
        return {
            status: "REJECTED",
            reason: "Unable to analyze image. Please upload a clear photo of your face.",
            confidence: 0,
            details: {
                hasFace: false,
                isProfessional: false,
                isAppropriate: false,
            }
        };
    }
}

// Check image for inappropriate content (used for any uploaded image)
export async function moderateImage(imageBase64: string): Promise<{
    safe: boolean;
    reason?: string;
}> {
    if (GROQ_KEYS.length === 0) {
        throw new Error("GROQ_VISION_NO_KEYS");
    }

    const prompt = `Check this image for inappropriate content.

Is this image safe for a professional platform?
- No nudity or sexually suggestive content
- No violence or gore
- No hate symbols or offensive imagery
- No illegal content

Respond with ONLY this JSON:
{
  "safe": true/false,
  "reason": "explanation if not safe"
}`;

    const result = await callGroqVisionWithKey(GROQ_KEYS[currentKeyIndex], imageBase64, prompt);

    if (!result.success) {
        // Fail closed - reject if we can't verify
        return { safe: false, reason: "Unable to verify image safety" };
    }

    try {
        const jsonMatch = result.data!.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch?.[0] || "{}");
        return {
            safe: parsed.safe === true,
            reason: parsed.reason
        };
    } catch {
        return { safe: false, reason: "Failed to analyze image" };
    }
}
