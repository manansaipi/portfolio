import React from 'react';

const tokenizeInline = (rawText) => {
    let parts = [{ type: 'text', raw: rawText }];

    const extract = (regex, type, mapMatch) => {
        parts = parts.flatMap((part) => {
            if (part.type !== 'text') return part;
            const res = [];
            let lastIndex = 0;
            let match;
            regex.lastIndex = 0;
            while ((match = regex.exec(part.raw)) !== null) {
                if (match.index > lastIndex) {
                    res.push({ type: 'text', raw: part.raw.substring(lastIndex, match.index) });
                }
                res.push({ type, raw: match[0], ...mapMatch(match) });
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < part.raw.length) {
                res.push({ type: 'text', raw: part.raw.substring(lastIndex) });
            }
            return res.length > 0 ? res : [part];
        });
    };

    extract(/\[([^\]]+)\]\(([^)]+)\)/g, 'link', m => ({ label: m[1], url: m[2] }));
    extract(/\*\*([^*]+)\*\*/g, 'bold', m => ({ text: m[1] }));
    extract(/\*([^*]+)\*/g, 'italic', m => ({ text: m[1] }));
    extract(/(\/help|\/exit|Ctrl\+C)/gi, 'keyword', m => ({ text: m[1] }));

    return parts;
};

const parseMarkdownToAST = (text) => {
    if (typeof text !== 'string') return [];
    
    const lines = text.split('\n');
    const nodes = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isLast = i === lines.length - 1;
        
        let cleanLine = line;
        let isBullet = false;
        let prefixRaw = '';
        
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            isBullet = true;
            const leadingSpaces = line.length - line.trimStart().length;
            prefixRaw = line.substring(0, leadingSpaces + 2);
            cleanLine = line.substring(leadingSpaces + 2);
        }
        
        const inlineNodes = tokenizeInline(cleanLine);
        
        nodes.push({
            type: 'line',
            isBullet: isBullet,
            prefixRaw: prefixRaw,
            inlineNodes: inlineNodes,
            hasNewline: !isLast,
            rawLength: line.length + (isLast ? 0 : 1) // +1 for '\n'
        });
    }
    
    return nodes;
};

const renderInlinePartially = (node, k, key) => {
    if (node.type === 'text') {
        return <span key={key}>{node.raw.substring(0, k)}</span>;
    }
    if (node.type === 'bold') {
        const visibleK = Math.max(0, Math.min(k - 2, node.text.length));
        return <strong key={key} className="font-bold text-white">{node.text.substring(0, visibleK)}</strong>;
    }
    if (node.type === 'italic') {
        const visibleK = Math.max(0, Math.min(k - 1, node.text.length));
        return <em key={key} className="italic text-purple-200">{node.text.substring(0, visibleK)}</em>;
    }
    if (node.type === 'link') {
        const visibleK = Math.max(0, Math.min(k - 1, node.label.length));
        return (
            <a 
                key={key}
                href={k >= node.raw.length ? node.url : "#"} 
                target={k >= node.raw.length ? "_blank" : undefined}
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 underline font-semibold"
            >
                {node.label.substring(0, visibleK)}
            </a>
        );
    }
    if (node.type === 'keyword') {
        return <strong key={key} className="font-bold text-white bg-white/10 px-1 rounded mx-0.5">{node.text.substring(0, k)}</strong>;
    }
    return null;
};

export const renderMarkdownWithProgress = (text, progressCount) => {
    const ast = parseMarkdownToAST(text);
    
    let remaining = progressCount;
    const renderedLines = [];
    
    for (let lineIdx = 0; lineIdx < ast.length; lineIdx++) {
        const lineNode = ast[lineIdx];
        if (remaining <= 0) break;
        
        let k = remaining;
        let bulletVisible = false;
        
        if (lineNode.isBullet) {
            if (k > lineNode.prefixRaw.length) {
                bulletVisible = true;
                k -= lineNode.prefixRaw.length;
            } else {
                if (k > 0) bulletVisible = true;
                k = 0;
            }
        }
        
        const renderedInline = [];
        for (let idx = 0; idx < lineNode.inlineNodes.length; idx++) {
            const inline = lineNode.inlineNodes[idx];
            if (k <= 0) break;
            
            if (k >= inline.raw.length) {
                renderedInline.push(renderInlinePartially(inline, inline.raw.length, idx));
                k -= inline.raw.length;
            } else {
                renderedInline.push(renderInlinePartially(inline, k, idx));
                k = 0;
            }
        }
        
        remaining -= lineNode.rawLength;
        
        if (lineNode.isBullet) {
            if (!bulletVisible) {
                renderedLines.push(<div key={lineIdx} className="min-h-[1.5em]"></div>);
            } else {
                renderedLines.push(
                    <div key={lineIdx} className="pl-4 flex items-start gap-1.5 my-0.5">
                        <span className="text-purple-400 shrink-0">•</span>
                        <span>{renderedInline}</span>
                    </div>
                );
            }
        } else {
            renderedLines.push(<div key={lineIdx} className="min-h-[1.5em]">{renderedInline}</div>);
        }
    }
    
    return renderedLines;
};

export const renderMarkdown = (text) => {
    return renderMarkdownWithProgress(text, text ? text.length : 0);
};

export const renderFormattedText = (text) => {
    // For backwards compatibility, render formatted text just renders fully
    return renderMarkdown(text);
};
