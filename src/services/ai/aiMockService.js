import { mockAudioBase64 } from './aiMockAudio';

export const getMockAiResponse = (question) => {
    const questionLower = question.toLowerCase();
    let mockResponse = "";
    
    if (/contact|email|reach|social|hubungi/i.test(questionLower)) {
        mockResponse = "Certainly! You can reach out to Abdul Mannan Saipi via email at **abdulmannan.saipi@gmail.com**.\n\nYou can also connect with him through his social profiles:\n*   **LinkedIn:** [linkedin.com/in/abdulmannansaipi](https://www.linkedin.com/in/abdulmannansaipi)\n*   **GitHub:** [github.com/manansaipi](https://github.com/manansaipi)\n*   **Instagram:** [instagram.com/manansaipi](https://www.instagram.com/manansaipi)\n\nLet me know if you need anything else! If you'd like to leave, you can type `/exit` or press Ctrl+C.";
    } else if (/experience|work|history|based|kerja|pengalaman|who/i.test(questionLower)) {
        mockResponse = "Abdul Mannan Saipi is a Software Engineer with over 2 years of professional experience. He is currently based in Central Jakarta, Indonesia.\n\nThroughout his career, he has worked at Samsung R&D Indonesia, LG Sinarmas Technology Solutions, PT Mattel Indonesia, and the Sekretariat Jendral DPR RI.";
    } else if (/boben|ben|nickname|panggilan/i.test(questionLower)) {
        mockResponse = "\"Ben\" (or \"Boben\") is the nickname for Abdul Mannan Saipi, used exclusively by his close family and friends. \n\nIs there anything else you'd like to know about Abdul's professional experience or projects? If you'd like to leave, you can type `/exit` or press Ctrl+C.";
    } else {
        // Fallback case that perfectly matches the audio from the database
        mockResponse = "I am the AI assistant for Abdul Mannan Saipi's portfolio. How can I help you learn more about his work, skills, or professional background today?";
    }

    return new Promise(resolve => {
        setTimeout(() => {
            // Use the real audio base64 fetched from the database
            const mockBase64 = mockAudioBase64;
            
            try {
                const byteCharacters = atob(mockBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'audio/mp3' });
                
                resolve({
                    text: mockResponse,
                    audioResult: {
                        audioBlob: blob,
                        audioBase64: mockBase64,
                        alignment: null
                    }
                });
            } catch (e) {
                // Fallback to text only if Blob creation fails in some mock environments
                resolve({
                    text: mockResponse,
                    audioResult: null
                });
            }
        }, 40000);
    });
};
