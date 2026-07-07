import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const askAI = async (question) => {
    // If in development mode, use a mock response to save API quota
    if (import.meta.env.DEV) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve("This is a mock response from the AI since you are running in development mode. It saves your Gemini API quota!");
            }, 4000);
        });
    }

    try {
        const response = await axios.post(`${API_URL}/api/ai/ask`, {
            question: question
        });
        return response.data.response;
    } catch (error) {
        console.warn("AI Backend Error:", error.message);
        
        // Handle 429 Too Many Requests from SlowAPI
        if (error.response && error.response.status === 429) {
            return "Sorry, you have reached the maximum limit of 5 AI prompts per day for your IP address.";
        }
        
        return "Sorry, the AI service is currently unavailable or quota exceeded.";
    }
};
