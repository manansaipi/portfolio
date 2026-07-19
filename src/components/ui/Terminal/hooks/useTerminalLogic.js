import { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../../../App';
import { getAllWorks } from '@services/work';
import { getAllWritings } from '@services/post';
import { getCertificates } from '@services/admin';
import { askAI, generateSpeech } from '@services/ai';
import { logTerminalCommand as apiLogTerminalCommand } from '@services/terminal';

const AVAILABLE_COMMANDS = [
    '/help', '/ask', '/about', '/experience', '/education', '/skills', '/projects', '/writings', 
    '/certificates', '/clear', '/theme', 'whoami', 'date'
];

export const useTerminalLogic = (isEmbed = false) => {
    const { toggleTheme, theme } = useContext(AppContext);
    const audioRef = useRef(null);
    
    const lastLogTimeRef = useRef(0);
    const logTerminalCommand = (originalInput, isAiMode, responseText, timeMs) => {
        const now = Date.now();
        if (now - lastLogTimeRef.current > 1500) {
            apiLogTerminalCommand(originalInput, isAiMode, responseText, timeMs);
            lastLogTimeRef.current = now;
        }
    };

    const [isAiMode, setIsAiMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
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
        if (isProcessing) {
            e.preventDefault();
            return;
        }

        const stopSpeech = () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };

        const speakText = async (text) => {
            if (!text) return null;
            stopSpeech();
            
            const result = await generateSpeech(text);
            if (result && result.audioBlob) {
                const audioUrl = URL.createObjectURL(result.audioBlob);
                const audioRef = new window.Audio(audioUrl);
                
                try {
                    await audioRef.play();
                    return { audioRef: audioRef, alignment: result.alignment };
                } catch (e) {
                    console.error("Audio playback blocked by browser:", e);
                    // Return null so the terminal falls back to normal typing without audio sync
                    return null;
                }
            }
            return null;
        };

        if (e.ctrlKey && e.key.toLowerCase() === 'c') {
            if (isAiMode) {
                stopSpeech();
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

            const startTime = performance.now();
            setIsProcessing(true);

            if (isAiMode) {
                if (command === '/exit') {
                    stopSpeech();
                    setIsAiMode(false);
                    setHistory((prev) => [...prev, { type: 'system', content: 'Exited AI mode.' }]);
                    logTerminalCommand(originalInput, true, 'Exited AI mode.', Math.round(performance.now() - startTime));
                    setIsProcessing(false);
                    return;
                }

                stopSpeech();
                setHistory((prev) => [...prev, { type: 'system', content: 'Thinking...' }]);
                let responseTextToLog = '';
                try {
                    const response = await askAI(originalInput);
                    responseTextToLog = response || ' ';
                    
                    let syncData = null;
                    if (!isEmbed) {
                        syncData = await speakText(responseTextToLog);
                    }
                    
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory.pop(); // Remove "Thinking..."
                        return [...newHistory, { type: 'ai-response', content: responseTextToLog, syncData }];
                    });
                } catch (error) {
                    responseTextToLog = 'Failed to connect to AI.';
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory.pop();
                        return [...newHistory, { type: 'error', content: responseTextToLog }];
                    });
                }
                logTerminalCommand(originalInput, true, responseTextToLog, Math.round(performance.now() - startTime));
                setIsProcessing(false);
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
                    let responseTextToLog = '';
                    try {
                        const response = await askAI(question);
                        responseTextToLog = response || ' ';
                        
                        let syncData = null;
                        if (!isEmbed) {
                            syncData = await speakText(responseTextToLog);
                        }
                        
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory.pop();
                            return [...newHistory, { type: 'ai-response', content: responseTextToLog, syncData }];
                        });
                    } catch (error) {
                        responseTextToLog = 'Failed to connect to AI.';
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory.pop();
                            return [...newHistory, { type: 'error', content: responseTextToLog }];
                        });
                    }
                    logTerminalCommand(originalInput, false, responseTextToLog, Math.round(performance.now() - startTime));
                } else {
                    logTerminalCommand(originalInput, false, 'Entered AI mode.', Math.round(performance.now() - startTime));
                }
                setIsProcessing(false);
                return;
            }

            let systemResponseText = '';

            switch (command) {
                case '/help':
                    systemResponseText = '[Displayed available commands]';
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
                    systemResponseText = '[Displayed about section]';
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: 'Hello! I am Abdul Mannan Saipi.' },
                        { type: 'output', content: 'I am a Software Engineer with over 2 years of experience, proficient in full-stack web, mobile, and machine learning development.' },
                        { type: 'output', content: 'Currently working as a Software Engineer at Samsung R&D Indonesia.' },
                        { type: 'output', content: 'I turn problems into products. Every line of code is written with clarity and purpose.' }
                    ]);
                    break;
                case '/education':
                    systemResponseText = '[Displayed education]';
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
                    systemResponseText = '[Displayed skills]';
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
                    systemResponseText = '[Displayed projects]';
                    import('@constants/projects').then(({ PROJECTS }) => {
                        const projectsOutput = [];
                        PROJECTS.forEach((p, idx) => {
                            if (idx > 0) projectsOutput.push({ type: 'output', content: ' ' });
                            projectsOutput.push({ type: 'output', content: `🚀 ${p.title}` });
                            projectsOutput.push({ type: 'output', content: `   ${p.description}` });
                        });
                        setHistory((prev) => [...prev, ...projectsOutput]);
                    }).catch(err => {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Failed to load projects.' }]);
                    });
                    break;
                case '/experience':
                    setHistory((prev) => [...prev, { type: 'system', content: 'Fetching experiences from API...' }]);
                    try {
                        const works = await getAllWorks();
                        const worksOutput = works.map((w, index) => {
                            const role = w.position || w.role || 'Unknown Role';
                            const startDate = w.start_date || w.startDate || 'Unknown';
                            const endDate = w.end_date || w.endDate || 'Unknown';
                            return {
                                type: 'output',
                                content: `[${index + 1}] ${role} at ${w.company} (${startDate} - ${endDate})`
                            };
                        });
                        setHistory((prev) => [...prev, ...worksOutput]);
                        systemResponseText = `[Fetched ${works.length} experiences]`;
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching experiences.' }]);
                        systemResponseText = 'Error fetching experiences.';
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
                        systemResponseText = `[Fetched ${posts.length} writings]`;
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching writings.' }]);
                        systemResponseText = 'Error fetching writings.';
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
                        systemResponseText = `[Fetched ${certs.length} certificates]`;
                    } catch (err) {
                        setHistory((prev) => [...prev, { type: 'error', content: 'Error fetching certificates.' }]);
                        systemResponseText = 'Error fetching certificates.';
                    }
                    break;
                case '/clear':
                    setHistory([]);
                    systemResponseText = '[Cleared screen]';
                    break;
                case '/theme':
                    toggleTheme();
                    const newThemeState = theme === 'light' ? 'dark' : 'light';
                    const themeMsg = `Switched to ${newThemeState} mode.`;
                    setHistory((prev) => [...prev, { type: 'system', content: themeMsg }]);
                    systemResponseText = themeMsg;
                    break;
                case 'whoami':
                    setHistory((prev) => [...prev, { type: 'output', content: 'guest' }]);
                    systemResponseText = 'guest';
                    break;
                case 'date':
                    const jakartaDate = new Date().toLocaleString('en-US', { 
                        timeZone: 'Asia/Jakarta',
                        weekday: 'short', month: 'short', day: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
                    }) + ' WIB (Jakarta)';
                    setHistory((prev) => [...prev, { type: 'output', content: jakartaDate }]);
                    systemResponseText = jakartaDate;
                    break;
                default:
                    setHistory((prev) => [
                        ...prev,
                        { type: 'error', content: `Command not found: ${command}` },
                        { type: 'output', content: 'Type /help for a list of commands.' }
                    ]);
                    systemResponseText = `Command not found: ${command}`;
            }

            logTerminalCommand(originalInput, false, systemResponseText, Math.round(performance.now() - startTime));
            setIsProcessing(false);
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
