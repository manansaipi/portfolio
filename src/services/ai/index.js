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
        
        let audioResult = null;
        if (response.data.audio && response.data.audio.audio_base64) {
            const byteCharacters = atob(response.data.audio.audio_base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const mimeType = response.data.audio.audio_format || 'audio/mpeg';
            const blob = new Blob([byteArray], { type: mimeType });
            
            audioResult = {
                audioBlob: blob,
                audioBase64: response.data.audio.audio_base64,
                alignment: response.data.audio.alignment
            };
        }
        
        return {
            text: response.data.response,
            audioResult: audioResult
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


