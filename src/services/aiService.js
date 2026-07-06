import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you add this to your .env file: VITE_GEMINI_API_KEY=your_api_key_here
const API_KEY_1 = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_KEY_2 = import.meta.env.VITE_GEMINI_API_KEY_2 || "";
const API_KEYS = [API_KEY_1, API_KEY_2].filter(key => key !== "");

const SYSTEM_PROMPT = `
You are an AI assistant built into the terminal of Abdul Mannan Saipi's personal portfolio website.
Your job is to answer questions from visitors about Abdul Mannan Saipi based strictly on the provided context below.
Be concise, friendly, and act as a representative for him. If the user asks something completely unrelated to Abdul or his expertise, politely guide them back to topics about his work, skills, or portfolio.
If a user asks how to leave, exit, or stop chatting with you, let them know they can type /exit or press Ctrl+C to return to the normal terminal mode.

--- Context about Abdul Mannan Saipi ---
Role: Software Engineer
Location: Central Jakarta, Indonesia
Contact: abdulmannan.saipi@gmail.com

Experience:
1. Software Engineer at SAMSUNG R&D Indonesia (Dec 2025 - Present)
   - Contributed to dashboards for Samsung devices for HQ in Suwon.
   - Built Air Care SmartThings plugin and SmartThings Find app.
2. Software Engineer at LG Sinarmas Technology Solutions (Dec 2024 - Dec 2025)
   - Built smart factory systems for EV battery manufacturing.
   - Developed MES backend logic and recruitment job portals (React, TypeScript).
3. Full Stack Developer Intern at PT Mattel Indonesia (Jan - Dec 2024)
   - Led digital transformation of manual processes using ASP.NET, Power Apps, SQL Server.
4. IT Programmer Intern at Sekretariat Jendral DPR RI (Aug - Dec 2023)

Education:
- President University, BCs in Informatics, Magna Cumlaude (GPA: 3.88). Capstone: AudioVision.
- Bangkit Academy (Cloud Computing) led by Google, Tokopedia, Gojek & Traveloka.

Skills:
- Languages: Python, Dart, JavaScript, TypeScript, Java, PHP, C#, VB, SQL
- Frameworks: FastAPI, React, Flutter, Node.js, Express, .NET, ASP, Laravel, Spring Boot
- Cloud & DevOps: Google Cloud Platform (GCP), AWS, Docker, Firebase, Git
- Databases: PostgreSQL, MySQL, SQL Server, SQFLite
- AI & Data: TensorFlow, Machine Learning, Power BI

Projects:
- AudioVision: Real-Time Object Detection Mobile App using YOLOv8 & TensorFlow Lite.
- Serfee API: RESTful backend on GCP Cloud Run and App Engine.
- Ticketing Web App v2: Laravel app with Telegram chatbot integration.
`;

export const askAI = async (question) => {
    if (API_KEYS.length === 0) {
        return "System error: Gemini API key is missing. The site owner needs to add VITE_GEMINI_API_KEY to their environment variables.";
    }

    // Fallback system: try each key sequentially
    for (const key of API_KEYS) {
        try {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-2.5-flash",
                systemInstruction: SYSTEM_PROMPT 
            });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: question }] }],
                generationConfig: {
                    maxOutputTokens: 150, // Maximize token savings by keeping it concise
                    temperature: 0.7,
                }
            });
            
            return result.response.text();
        } catch (error) {
            console.error("AI Error with a key:", error);
            // If it's the last key in the array, let it fail
            if (key === API_KEYS[API_KEYS.length - 1]) {
                return "Sorry, the AI service is currently unavailable or quota exceeded.";
            }
            // Otherwise, loop will continue to the next key
        }
    }
    
    return "Sorry, all API services are currently unavailable.";
};
