import { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import { getAllWorks } from '@services/workService';
import { getAllWritings } from '@services/postService';
import { getCertificates } from '@services/adminService';
import { askAI } from '@services/aiService';

const AVAILABLE_COMMANDS = [
    '/help', '/ask', '/about', '/experience', '/education', '/skills', '/projects', '/writings', 
    '/certificates', '/clear', '/theme', 'whoami', 'date'
];

export const useTerminalLogic = () => {
    const { toggleTheme, theme } = useContext(AppContext);
    
    const [isAiMode, setIsAiMode] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([
        { type: 'system', content: 'Welcome to My Portfolio Terminal' },
        { type: 'system', content: 'Type /help to see available commands.' },
    ]);

    const matches = input.length > 0 
        ? AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(input.toLowerCase()))
        : [];
    const suggestion = matches.length > 0 ? matches[0] : '';

    const handleCommand = async (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            if (isAiMode) {
                setIsAiMode(false);
                setInput('');
                setHistory((prev) => [...prev, { type: 'system', content: 'Exited AI mode.' }]);
                return;
            }
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            if (suggestion) {
                setInput(suggestion);
            }
        } else if (e.key === 'Enter') {
            if (!isAiMode && suggestion && input.trim().toLowerCase() !== suggestion.toLowerCase()) {
                e.preventDefault();
                setInput(suggestion);
                return;
            }

            const currentPrompt = isAiMode ? 'ai@manansaipi-portfolio:~$ ' : 'guest@manansaipi-portfolio:~$ ';
            
            if (!input.trim()) {
                setHistory((prev) => [...prev, { type: 'command', content: currentPrompt }]);
                return;
            }

            const command = input.trim().toLowerCase();
            const originalInput = input.trim();
            setInput('');
            setHistory((prev) => [...prev, { type: 'command', content: `${currentPrompt}${originalInput}` }]);

            if (isAiMode) {
                if (command === '/exit') {
                    setIsAiMode(false);
                    setHistory((prev) => [...prev, { type: 'system', content: 'Exited AI mode.' }]);
                    return;
                }

                setHistory((prev) => [...prev, { type: 'system', content: 'Thinking...' }]);
                try {
                    const response = await askAI(originalInput);
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory.pop(); // Remove "Thinking..."
                        return [...newHistory, { type: 'ai-response', content: response || ' ' }];
                    });
                } catch (error) {
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory.pop();
                        return [...newHistory, { type: 'error', content: 'Failed to connect to AI.' }];
                    });
                }
                return;
            }

            if (command.startsWith('/ask')) {
                setIsAiMode(true);
                setHistory((prev) => [
                    ...prev, 
                    { type: 'system', content: 'Entered AI mode. You can now chat freely! Type /exit or press Ctrl+C to leave.' }
                ]);
                
                const question = originalInput.substring(4).trim();
                if (question) {
                    setHistory((prev) => [...prev, { type: 'system', content: 'Thinking...' }]);
                    try {
                        const response = await askAI(question);
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory.pop();
                            return [...newHistory, { type: 'ai-response', content: response || ' ' }];
                        });
                    } catch (error) {
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory.pop();
                            return [...newHistory, { type: 'error', content: 'Failed to connect to AI.' }];
                        });
                    }
                }
                return;
            }

            switch (command) {
                case '/help':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: 'Available commands:' },
                        { type: 'highlight', content: '/ask [msg]    - Enter AI Chat mode to ask about me' },
                        { type: 'output', content: '  /about        - Brief information about me' },
                        { type: 'output', content: '  /experience   - Fetch my latest work experiences' },
                        { type: 'output', content: '  /education    - My educational background' },
                        { type: 'output', content: '  /skills       - Technical skills and tools' },
                        { type: 'output', content: '  /projects     - Notable projects I have built' },
                        { type: 'output', content: '  /writings     - Fetch my recent blog posts' },
                        { type: 'output', content: '  /certificates - Fetch my certificates' },
                        { type: 'output', content: '  /theme        - Toggle light/dark theme' },
                        { type: 'output', content: '  /clear        - Clear terminal screen' },
                        { type: 'output', content: '  whoami        - Print current user' },
                        { type: 'output', content: '  date          - Print current date and time' }
                    ]);
                    break;
                case '/about':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: 'Hello! I am Abdul Mannan Saipi.' },
                        { type: 'output', content: 'I am a Software Engineer with over 2 years of experience, proficient in full-stack web, mobile, and machine learning development.' },
                        { type: 'output', content: 'Currently working as a Software Engineer at Samsung R&D Indonesia.' },
                        { type: 'output', content: 'I turn problems into products. Every line of code is written with clarity and purpose.' }
                    ]);
                    break;
                case '/education':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: '🎓 President University (Sep 2021 - Dec 2024)' },
                        { type: 'output', content: '   BCs in Informatics | Magna Cumlaude (GPA: 3.88)' },
                        { type: 'output', content: '   Capstone: Developed AudioVision, an ML-based mobile app for visually impaired users.' },
                        { type: 'output', content: ' ' },
                        { type: 'output', content: '☁️ Bangkit Academy led by Google, Tokopedia, Gojek & Traveloka (Feb - Jul 2023)' },
                        { type: 'output', content: '   Cloud Computing Distinction | Achieved 7 certifications from Google and Dicoding.' }
                    ]);
                    break;
                case '/skills':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: '💻 Languages: Python, Dart, JavaScript, TypeScript, Java, PHP, C#, VB, SQL' },
                        { type: 'output', content: '🛠️ Frameworks: FastAPI, React, Flutter, Node.js, Express, .NET, ASP, Laravel, Spring Boot' },
                        { type: 'output', content: '☁️ Cloud & DevOps: Google Cloud Platform (GCP), AWS, Docker, Firebase, Git' },
                        { type: 'output', content: '🗄️ Databases: PostgreSQL, MySQL, SQL Server, SQFLite' },
                        { type: 'output', content: '🤖 AI & Data: TensorFlow, Machine Learning, Power BI' }
                    ]);
                    break;
                case '/projects':
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: '📱 AudioVision: Real-Time Object Detection Mobile App' },
                        { type: 'output', content: '   Uses YOLOv8 and TensorFlow Lite to assist visually impaired users with audio navigation.' },
                        { type: 'output', content: ' ' },
                        { type: 'output', content: '☁️ Serfee API: Robust Backend for Mobile Services' },
                        { type: 'output', content: '   RESTful APIs deployed on GCP using Cloud Run, App Engine, Docker, and CI/CD pipelines.' },
                        { type: 'output', content: ' ' },
                        { type: 'output', content: '🎫 Ticketing Web Application v2' },
                        { type: 'output', content: '   Built with Laravel and Bootstrap, integrating Telegram chatbots for instant notifications.' }
                    ]);
                    break;
                case '/experience':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching experiences from API...' }]);
                    try {
                        const works = await getAllWorks();
                        const worksOutput = works.map((w, index) => ({
                            type: 'output',
                            content: `[${index + 1}] ${w.title} at ${w.company} (${w.duration}) - ${w.type}`
                        }));
                        setHistory((prev) => [...prev, ...worksOutput]);
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching experiences.' }]);
                    }
                    break;
                case '/writings':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching posts from API...' }]);
                    try {
                        const posts = await getAllWritings();
                        const postsOutput = posts.map((p, index) => ({
                            type: 'output',
                            content: `[${index + 1}] ${p.title} - ${p.category} (${p.date || 'Unknown date'})`
                        }));
                        setHistory((prev) => [...prev, ...postsOutput]);
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching writings.' }]);
                    }
                    break;
                case '/certificates':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching certificates from API...' }]);
                    try {
                        const certs = await getCertificates();
                        const certsOutput = certs.map((c, index) => ({
                            type: 'output',
                            content: `[${index + 1}] ${c.name} (${c.year})`
                        }));
                        setHistory((prev) => [...prev, ...certsOutput]);
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching certificates.' }]);
                    }
                    break;
                case '/clear':
                    setHistory([]);
                    break;
                case '/theme':
                    toggleTheme();
                    const newThemeState = theme === 'light' ? 'dark' : 'light';
                    setHistory((prev) => [...prev, { type: 'system', content: `Switched to ${newThemeState} mode.` }]);
                    break;
                case 'whoami':
                    setHistory((prev) => [...prev, { type: 'output', content: 'guest' }]);
                    break;
                case 'date':
                    const jakartaDate = new Date().toLocaleString('en-US', { 
                        timeZone: 'Asia/Jakarta',
                        weekday: 'short', month: 'short', day: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    }) + ' WIB (Jakarta)';
                    setHistory((prev) => [...prev, { type: 'output', content: jakartaDate }]);
                    break;
                default:
                    setHistory((prev) => [
                        ...prev,
                        { type: 'error', content: `Command not found: ${command}` },
                        { type: 'output', content: 'Type /help for a list of commands.' }
                    ]);
            }
        }
    };

    return {
        input,
        setInput,
        history,
        suggestion: isAiMode ? '' : suggestion, // disable suggestions in AI mode
        handleCommand,
        isAiMode
    };
};
