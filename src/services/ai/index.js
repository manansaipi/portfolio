import api from '../api';
import { getMockAiResponse } from './aiMockService';

export const askAI = async (question) => {
    const isEmbed = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';

    if (isEmbed) {
        return await getMockAiResponse(question);
    }

    try {
        const response = await api.post(`/api/ai/ask`, {
            question: question
        });
        
        return {
            text: response.data.response,
            signature: response.data.signature,
            audioResult: null
        };
    } catch (error) {
        console.warn("AI Backend Error:", error.message);
        
        // Handle 429 Too Many Requests from SlowAPI
        if (error.response && error.response.status === 429) {
            return { text: "Sorry, you have reached the maximum limit of 5 AI prompts per day for your IP address.", audioResult: null };
        }
        
        return { text: "Sorry, the AI service is currently unavailable or quota exceeded.", audioResult: null };
    }
};

export const generateTTS = async (text, signature) => {
    try {
        const response = await api.post(`/api/tts/generate`, {
            text: text,
            signature: signature || ""
        });
        
        if (response.data && response.data.audio_base64) {
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
                audioBase64: response.data.audio_base64,
                alignment: response.data.alignment
            };
        }
        return null;
    } catch (error) {
        console.error("TTS Backend Error:", error.message);
        return null;
    }
};


