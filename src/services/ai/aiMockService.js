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
        mockResponse = `This is a mock response from the AI for the question: "${question}". Try asking about his contact details, experience, or nickname to see styled markdown tests!`;
    }

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockResponse);
        }, 2000);
    });
};
