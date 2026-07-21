import { useState, useEffect, useContext, useRef } from 'react';
import { AppContext } from '../../../../App';
import { getAllWorks } from '@services/work';
import { getAllWritings } from '@services/post';
import { getCertificates } from '@services/admin';
import { askAI } from '@services/ai';
import { logTerminalCommand as apiLogTerminalCommand } from '@services/terminal';

const AVAILABLE_COMMANDS = [
    '/help', '/ask', '/about', '/experience', '/education', '/skills', '/projects', '/writings', 
    '/certificates', '/clear', '/theme', 'whoami', 'date'
];

const THINKING_MESSAGES = [
    "Thinking...",
    "Brewing some virtual coffee...",
    "Consulting the AI matrix...",
    "Loading 99%...",
    "Asking the rubber duck...",
    "Generating an insightful response...",
    "Sorry for the wait, almost there...",
    "Reticulating splines...",
    "Checking with the backend hamsters...",
    "Compiling the best possible answer...",
    "Still thinking, promise I haven't crashed...",
    "Gathering data from the cyberverse..."
];

export const useTerminalLogic = (isEmbed = false) => {
    const { toggleTheme, theme } = useContext(AppContext);
    const audioRef = useRef(null);
    
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new window.Audio();
        }
    }, []);
    
    const lastLogTimeRef = useRef(0);
    const logTerminalCommand = (originalInput, isAiMode, responseText, timeMs, audioBase64 = null) => {
        const now = Date.now();
        if (now - lastLogTimeRef.current > 1500) {
            apiLogTerminalCommand(originalInput, isAiMode, responseText, timeMs, audioBase64);
            lastLogTimeRef.current = now;
        }
    };

    const [isAiMode, setIsAiMode] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [history, setHistory] = useState([
        { type: 'system', content: 'Welcome to My Portfolio Terminal' },
        { type: 'system', content: 'Type /help to see available commands.' },
    ]);

    const matches = input.length > 0 
        ? AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(input.toLowerCase()))
        : [];
    const suggestion = matches.length > 0 ? matches[0] : '';

    const handleCommand = async (e) => {
        if (isProcessing || isStreaming) {
            e.preventDefault();
            return;
        }

        const stopSpeech = () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };

        const playAudio = async (audioResult) => {
            if (!audioResult || !audioResult.audioBlob || !audioRef.current) return null;
            stopSpeech();
            
            const audioUrl = URL.createObjectURL(audioResult.audioBlob);
            audioRef.current.src = audioUrl;
            
            try {
                await audioRef.current.play();
                return { audioRef: audioRef.current, alignment: audioResult.alignment };
            } catch (e) {
                console.error("Audio playback blocked by browser:", e);
                // Return null so the terminal falls back to normal typing without audio sync
                return null;
            }
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

        if (e.key === 'ArrowUp') {
            if (commandHistory.length > 0) {
                e.preventDefault();
                const newIndex = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
                if (newIndex !== -1) {
                    setHistoryIndex(newIndex);
                    setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                }
            }
            return;
        } else if (e.key === 'ArrowDown') {
            if (historyIndex > -1) {
                e.preventDefault();
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                if (newIndex === -1) {
                    setInput('');
                } else {
                    setInput(commandHistory[commandHistory.length - 1 - newIndex]);
                }
            }
            return;
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

            // iOS WebKit Autoplay Unlock: synchronously interact with the persistent audio object 
            // during the trusted user gesture (Enter keydown) before any async API calls.
            if (audioRef.current) {
                if (!audioRef.current.src || audioRef.current.src === window.location.href) {
                    // Load a tiny silent MP3 base64 to initialize the audio context
                    audioRef.current.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//MQAAAAAAASWAAAAA";
                }
                audioRef.current.play().then(() => {
                    audioRef.current.pause();
                }).catch(() => {}); // Ignore play() interrupt errors
            }

            const currentPrompt = isAiMode ? 'ai@manansaipi-portfolio:~$ ' : 'guest@manansaipi-portfolio:~$ ';
            
            if (!input.trim()) {
                setHistory((prev) => [...prev, { type: 'command', content: currentPrompt }]);
                return;
            }

            const command = input.trim().toLowerCase();
            const originalInput = input.trim();
            if (originalInput) {
                setCommandHistory(prev => {
                    if (prev.length > 0 && prev[prev.length - 1] === originalInput) return prev;
                    return [...prev, originalInput];
                });
            }
            setHistoryIndex(-1);
            
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
                let thinkingIndex = 0;
                setHistory((prev) => [...prev, { type: 'loading', content: THINKING_MESSAGES[0] }]);
                const thinkingInterval = setInterval(() => {
                    let nextIndex;
                    do {
                        nextIndex = Math.floor(Math.random() * (THINKING_MESSAGES.length - 1)) + 1;
                    } while (nextIndex === thinkingIndex);
                    thinkingIndex = nextIndex;
                    
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        if (newHistory.length > 0 && newHistory[newHistory.length - 1].type === 'loading') {
                            newHistory[newHistory.length - 1] = { type: 'loading', content: THINKING_MESSAGES[thinkingIndex] };
                        }
                        return newHistory;
                    });
                }, 5000);

                let responseTextToLog = '';
                let audioBase64Data = null;
                try {
                    const responseObj = await askAI(originalInput);
                    clearInterval(thinkingInterval);
                    // Handle both mock strings and the new combined object
                    responseTextToLog = typeof responseObj === 'string' ? responseObj : (responseObj?.text || ' ');

                    let syncData = null;
                    if (!isEmbed && typeof responseObj !== 'string' && responseObj?.audioResult) {
                        audioBase64Data = responseObj.audioResult.audioBase64;
                        syncData = await playAudio(responseObj.audioResult);
                    }
                    
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory.pop(); // Remove "Thinking..."
                        return [...newHistory, { type: 'ai-response', content: responseTextToLog, syncData }];
                    });
                    setIsStreaming(true);
                } catch (error) {
                    clearInterval(thinkingInterval);
                    responseTextToLog = 'Failed to connect to AI.';
                    setHistory((prev) => {
                        const newHistory = [...prev];
                        newHistory.pop();
                        return [...newHistory, { type: 'error', content: responseTextToLog }];
                    });
                }
                logTerminalCommand(originalInput, true, responseTextToLog, Math.round(performance.now() - startTime), audioBase64Data);
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
                    let thinkingIndex = 0;
                    setHistory((prev) => [...prev, { type: 'loading', content: THINKING_MESSAGES[0] }]);
                    const thinkingInterval = setInterval(() => {
                        let nextIndex;
                        do {
                            nextIndex = Math.floor(Math.random() * (THINKING_MESSAGES.length - 1)) + 1;
                        } while (nextIndex === thinkingIndex);
                        thinkingIndex = nextIndex;

                        setHistory((prev) => {
                            const newHistory = [...prev];
                            if (newHistory.length > 0 && newHistory[newHistory.length - 1].type === 'loading') {
                                newHistory[newHistory.length - 1] = { type: 'loading', content: THINKING_MESSAGES[thinkingIndex] };
                            }
                            return newHistory;
                        });
                    }, 5000);

                    let responseTextToLog = '';
                    let audioBase64Data = null;
                    try {
                        const responseObj = await askAI(question);
                        clearInterval(thinkingInterval);
                        // Handle both mock strings and the new combined object
                        responseTextToLog = typeof responseObj === 'string' ? responseObj : (responseObj?.text || ' ');

                        let syncData = null;
                        if (!isEmbed && typeof responseObj !== 'string' && responseObj?.audioResult) {
                            audioBase64Data = responseObj.audioResult.audioBase64;
                            syncData = await playAudio(responseObj.audioResult);
                        }
                        
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory.pop(); // Remove "Thinking..."
                            return [...newHistory, { type: 'ai-response', content: responseTextToLog, syncData }];
                        });
                        setIsStreaming(true);
                    } catch (error) {
                        clearInterval(thinkingInterval);
                        responseTextToLog = 'Failed to connect to AI.';
                        setHistory((prev) => {
                            const newHistory = [...prev];
                            newHistory.pop();
                            return [...newHistory, { type: 'error', content: responseTextToLog }];
                        });
                    }
                    logTerminalCommand(originalInput, false, responseTextToLog, Math.round(performance.now() - startTime), audioBase64Data);
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
                case 'sudo rm -rf /':
                    systemResponseText = 'NICE TRY! 💥';
                    setHistory((prev) => [
                        ...prev,
                        { type: 'error', content: 'PERMISSION DENIED: Nice try, but you do not have root privileges.' },
                        { type: 'error', content: 'This incident will be reported to Santa Claus.' }
                    ]);
                    break;
                case 'ping':
                    systemResponseText = 'pong';
                    const pingTime = Math.floor(Math.random() * 20) + 1;
                    setHistory((prev) => [
                        ...prev,
                        { type: 'output', content: `PONG! Response time: ${pingTime}ms` },
                        { type: 'output', content: '🏓 Ah, a classic. I am alive and well!' }
                    ]);
                    break;
                case '/matrix':
                    systemResponseText = 'Entering the Matrix...';
                    setHistory((prev) => [
                        ...prev,
                        { type: 'system', content: 'Wake up, Neo...' },
                        { type: 'matrix' }
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
        isAiMode,
        isProcessing,
        isStreaming,
        setIsStreaming
    };
};
