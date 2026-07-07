import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "./aiPrompt";

// Ensure you add this to your .env file: VITE_GEMINI_API_KEY=your_api_key_here
const API_KEY_1 = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2 || "";
const API_KEYS = [API_KEY_1, API_KEY_2].filter(key => key !== "");
const MODELS = [
    "gemini-3.5-flash",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.5-pro"
];

export const askAI = async (question) => {
    // If in development mode, use a mock response to save API quota
    if (import.meta.env.DEV) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve("This is a mock response from the AI since you are running in development mode. It saves your Gemini API quota!");
            }, 1000);
        });
    }

    // Check IP-based rate limit
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (ipResponse.ok) {
            const { ip } = await ipResponse.json();
            const today = new Date().toISOString().split('T')[0];
            const rateLimitKey = `ai_rate_limit_${ip}`;
            
            let rateLimitData = JSON.parse(localStorage.getItem(rateLimitKey) || '{}');
            
            if (rateLimitData.date !== today) {
                // Reset limit for new day
                rateLimitData = { date: today, count: 0 };
            }
            
            if (rateLimitData.count >= 5) {
                return "Sorry, you have reached the maximum limit of 5 AI prompts per day for your IP address.";
            }
            
            // Increment the count (we save it after successful generation or right away)
            rateLimitData.count += 1;
            localStorage.setItem(rateLimitKey, JSON.stringify(rateLimitData));
        }
    } catch (e) {
        console.warn("Failed to fetch IP or check rate limit", e);
        // We can either block or allow if IP fetch fails. Allowing is safer for UX.
    }

    if (API_KEYS.length === 0) {
        return "System error: Gemini API key is missing. The site owner needs to add VITE_GEMINI_API_KEY to their environment variables.";
    }

    // Fallback system: try each key and each model sequentially
    for (const key of API_KEYS) {
        for (const modelName of MODELS) {
            try {
                const genAI = new GoogleGenerativeAI(key);
                const model = genAI.getGenerativeModel({ 
                    model: modelName,
                    systemInstruction: SYSTEM_PROMPT
                });

                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: question }] }],
                    generationConfig: {
                        temperature: 0.7,
                    }
                });
                
                return result.response.text();
            } catch (error) {
                console.warn(`AI Error with a key using model ${modelName}:`, error.message);
                // If it's the last key in the array and the last model, let it fail
                if (key === API_KEYS[API_KEYS.length - 1] && modelName === MODELS[MODELS.length - 1]) {
                    return "Sorry, the AI service is currently unavailable or quota exceeded.";
                }
                // Otherwise, loop will continue to the next model or next key
            }
        }
    }
    
    return "Sorry, all API services are currently unavailable.";
};
