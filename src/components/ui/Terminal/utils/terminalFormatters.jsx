import React from 'react';

const renderInlineFormatting = (text) => {
    if (typeof text !== 'string') return text;

    let parts = [text];

    // 1. Link pattern: [text](url)
    parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return part;
        const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const res = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(part)) !== null) {
            if (match.index > lastIndex) {
                res.push(part.substring(lastIndex, match.index));
            }
            res.push({
                type: 'link',
                label: match[1],
                url: match[2]
            });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < part.length) {
            res.push(part.substring(lastIndex));
        }
        return res.length > 0 ? res : [part];
    });

    // 2. Bold pattern: **text**
    parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return part;
        const regex = /\*\*([^*]+)\*\*/g;
        const res = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(part)) !== null) {
            if (match.index > lastIndex) {
                res.push(part.substring(lastIndex, match.index));
            }
            res.push({
                type: 'bold',
                text: match[1]
            });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < part.length) {
            res.push(part.substring(lastIndex));
        }
        return res.length > 0 ? res : [part];
    });

    // 3. Italic pattern: *text* (avoiding double stars)
    parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return part;
        const regex = /\*([^*]+)\*/g;
        const res = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(part)) !== null) {
            if (match.index > lastIndex) {
                res.push(part.substring(lastIndex, match.index));
            }
            res.push({
                type: 'italic',
                text: match[1]
            });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < part.length) {
            res.push(part.substring(lastIndex));
        }
        return res.length > 0 ? res : [part];
    });

    // 4. Command keywords: /help, /exit, Ctrl+C
    parts = parts.flatMap((part) => {
        if (typeof part !== 'string') return part;
        const regex = /(\/help|\/exit|Ctrl\+C)/gi;
        const res = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(part)) !== null) {
            if (match.index > lastIndex) {
                res.push(part.substring(lastIndex, match.index));
            }
            res.push({
                type: 'keyword',
                text: match[1]
            });
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < part.length) {
            res.push(part.substring(lastIndex));
        }
        return res.length > 0 ? res : [part];
    });

    // Format parts into React nodes
    return parts.map((part, idx) => {
        if (typeof part === 'string') return part;
        if (part.type === 'link') {
            return (
                <a 
                    key={idx} 
                    href={part.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:text-blue-300 underline font-semibold"
                >
                    {part.label}
                </a>
            );
        }
        if (part.type === 'bold') {
            return <strong key={idx} className="font-bold text-white">{part.text}</strong>;
        }
        if (part.type === 'italic') {
            return <em key={idx} className="italic text-purple-200">{part.text}</em>;
        }
        if (part.type === 'keyword') {
            return <strong key={idx} className="font-bold text-white bg-white/10 px-1 rounded mx-0.5">{part.text}</strong>;
        }
        return null;
    });
};

export const renderMarkdown = (text) => {
    if (typeof text !== 'string') return text;

    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
        let isBullet = false;
        let cleanLine = line;
        
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            isBullet = true;
            const leadingSpaces = line.length - line.trimStart().length;
            cleanLine = ' '.repeat(leadingSpaces) + line.trim().substring(2);
        }

        const formatted = renderInlineFormatting(cleanLine);

        if (isBullet) {
            return (
                <div key={lineIdx} className="pl-4 flex items-start gap-1.5 my-0.5">
                    <span className="text-purple-400 shrink-0">•</span>
                    <span>{formatted}</span>
                </div>
            );
        }

        return <div key={lineIdx} className="min-h-[1.5em]">{formatted}</div>;
    });
};

export const renderFormattedText = (text) => {
    return renderInlineFormatting(text);
};
