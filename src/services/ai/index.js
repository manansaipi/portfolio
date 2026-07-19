import api from '../api';
import { getMockAiResponse } from './aiMockService';

export const askAI = async (question) => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';

    if (import.meta.env.DEV || isEmbed) {
        return await getMockAiResponse(question);
    }

    try {
        const response = await api.post(`/api/ai/ask`, {
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

export const generateSpeech = async (text) => {
    try {
        const response = await api.post(`/api/tts/generate`, { text: text });
        
        // Response contains audio_base64 and alignment
        if (response.data && response.data.audio_base64) {
            // Convert base64 to blob
            const byteCharacters = atob(response.data.audio_base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const mimeType = response.data.audio_format || 'audio/mpeg';
            const blob = new Blob([byteArray], { type: mimeType });
            
            return {
                audioBlob: blob,
                alignment: response.data.alignment
            };
        }
        return null;
    } catch (error) {
        console.error("TTS Backend Error:", error.message);
        return null;
    }
};
