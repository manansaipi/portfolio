import React from 'react';

const TerminalBody = ({ bodyRef, history, inputRef, input, setInput, handleCommand, suggestion, bottomRef }) => {
    return (
        <div ref={bodyRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm md:text-base [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {history.map((line, i) => (
                <div key={i} className={`mb-1.5 leading-relaxed break-words ${
                    line.type === 'command' ? 'text-white font-semibold' :
                    line.type === 'error' ? 'text-red-400' :
                    line.type === 'system' ? 'text-green-400 opacity-80' : 'text-gray-300'
                }`}>
                    {line.content}
                </div>
            ))}
            
            <div className="flex items-center mt-2 relative">
                <span className="text-green-400 font-semibold mr-2 shrink-0">guest@portfolio:~$</span>
                <div className="relative flex-1 flex items-center min-w-0">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleCommand}
                        className="relative z-10 w-full bg-transparent border-none outline-none text-white font-mono p-0 m-0"
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <div className="absolute inset-0 flex items-center pointer-events-none font-mono text-white/30 z-0">
                        <span className="invisible">{input}</span>
                        <span>{suggestion ? suggestion.slice(input.length) : ''}</span>
                    </div>
                </div>
            </div>
            <div ref={bottomRef} />
        </div>
    );
};

export default TerminalBody;
