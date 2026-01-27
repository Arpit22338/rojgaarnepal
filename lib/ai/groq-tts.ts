// Groq TTS API - Text-to-Speech using Orpheus Engine
// Real-time voice synthesis for interview questions

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_TTS_URL = "https://api.groq.com/openai/v1/audio/speech";
const GROQ_TTS_MODEL = "playai-tts"; // Groq's TTS model

// Fallback to OpenAI-compatible endpoint if needed
const GROQ_TTS_FALLBACK_URL = "https://api.groq.com/v1/audio/speech";

type VoiceEmotion = "professional" | "curious" | "encouraging" | "neutral" | "friendly";

interface TTSOptions {
    emotion?: VoiceEmotion;
    speed?: number; // 0.5 to 2.0
    voice?: "nova" | "alloy" | "echo" | "fable" | "onyx" | "shimmer";
}

// Emotion to SSML-like direction mapping
const EMOTION_DIRECTIONS: Record<VoiceEmotion, string> = {
    professional: "[speaking professionally and clearly]",
    curious: "[speaking with curiosity and interest]",
    encouraging: "[speaking warmly and encouragingly]",
    neutral: "",
    friendly: "[speaking in a friendly, welcoming tone]"
};

export async function textToSpeech(
    text: string,
    options: TTSOptions = {}
): Promise<ArrayBuffer> {
    const {
        emotion = "professional",
        speed = 1.0,
        voice = "nova"
    } = options;

    if (!GROQ_API_KEY) {
        throw new Error("GROQ_TTS_NO_KEY");
    }

    // Add emotion direction to text
    const direction = EMOTION_DIRECTIONS[emotion];
    const enhancedText = direction ? `${direction} ${text}` : text;

    try {
        const response = await fetch(GROQ_TTS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: GROQ_TTS_MODEL,
                input: enhancedText,
                voice,
                speed: Math.min(Math.max(speed, 0.5), 2.0),
                response_format: "mp3"
            }),
        });

        if (response.status === 429) {
            throw new Error("GROQ_TTS_RATE_LIMIT");
        }

        if (!response.ok) {
            // Try fallback approach - generate text for browser TTS
            console.warn("Groq TTS failed, falling back to browser TTS");
            throw new Error("GROQ_TTS_FALLBACK");
        }

        return await response.arrayBuffer();
    } catch (error) {
        // Re-throw to let caller handle fallback
        throw error;
    }
}

// Generate interview question with appropriate emotion
export async function speakInterviewQuestion(
    question: string,
    category: string
): Promise<ArrayBuffer> {
    // Map question category to emotion
    const emotionMap: Record<string, VoiceEmotion> = {
        "behavioral": "curious",
        "technical": "professional",
        "situational": "curious",
        "cultural": "friendly",
        "problem-solving": "professional",
        "default": "professional"
    };

    const emotion = emotionMap[category] || emotionMap.default;

    return textToSpeech(question, {
        emotion,
        speed: 0.95, // Slightly slower for clarity
        voice: "nova" // Professional female voice
    });
}

// Speak feedback/encouragement
export async function speakFeedback(
    feedbackText: string,
    isPositive: boolean
): Promise<ArrayBuffer> {
    return textToSpeech(feedbackText, {
        emotion: isPositive ? "encouraging" : "professional",
        speed: 1.0,
        voice: "nova"
    });
}

// Browser-based TTS fallback (returns instructions for client-side)
export function getBrowserTTSConfig(text: string, emotion: VoiceEmotion = "professional"): {
    text: string;
    rate: number;
    pitch: number;
} {
    const configs: Record<VoiceEmotion, { rate: number; pitch: number }> = {
        professional: { rate: 0.9, pitch: 1.0 },
        curious: { rate: 1.0, pitch: 1.1 },
        encouraging: { rate: 0.95, pitch: 1.05 },
        neutral: { rate: 1.0, pitch: 1.0 },
        friendly: { rate: 1.0, pitch: 1.05 }
    };

    const config = configs[emotion] || configs.neutral;

    return {
        text,
        rate: config.rate,
        pitch: config.pitch
    };
}
