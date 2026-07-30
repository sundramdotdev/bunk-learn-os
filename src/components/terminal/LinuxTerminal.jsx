import React from 'react';
import { Terminal as TermIcon, Circle, AlertCircle } from 'lucide-react';
import { useTerminal } from '../../hooks/useTerminal';

export default function LinuxTerminal() {
    const {
        input, setInput,
        history, bottomRef,
        getPrompt, handleKeyDown
    } = useTerminal();

    return (
        <div className="w-full h-[600px] bg-[#1e1e1e] flex flex-col font-mono text-sm shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Terminal Header */}
            <div className="bg-[#2d2d2d] h-10 flex items-center px-4 border-b border-black select-none shrink-0">
                <div className="flex gap-2 mr-4">
                    <Circle size={12} className="fill-[#ff5f56] text-[#ff5f56]" />
                    <Circle size={12} className="fill-[#ffbd2e] text-[#ffbd2e]" />
                    <Circle size={12} className="fill-[#27c93f] text-[#27c93f]" />
                </div>
                <div className="flex-1 flex justify-center items-center gap-2 text-slate-400">
                    <TermIcon size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-widest">user@bunkos:~</span>
                </div>
            </div>

            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-4 text-slate-300 scrollbar-thin scrollbar-thumb-slate-600 bg-[#1e1e1e]" onClick={() => document.getElementById('term-input').focus()}>
                {history.map((h, i) => {
                    if (h.type === 'sys') return <div key={i} className="text-emerald-400 mb-2">{h.content}</div>;
                    if (h.type === 'prompt') return (
                        <div key={i} className="flex">
                            <span className="text-emerald-400 font-bold mr-2">{h.prompt}</span>
                            <span>{h.cmd}</span>
                        </div>
                    );
                    if (h.type === 'err') return <div key={i} className="text-red-400 whitespace-pre-wrap">{h.content}</div>;
                    return <div key={i} className="whitespace-pre-wrap mb-1">{h.content}</div>;
                })}
                
                {/* Active Input Line */}
                <div className="flex mt-1">
                    <span className="text-emerald-400 font-bold mr-2 whitespace-pre">{getPrompt()}</span>
                    <input
                        id="term-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        autoComplete="off"
                        spellCheck="false"
                        className="flex-1 bg-transparent outline-none text-slate-300 caret-slate-300"
                    />
                </div>
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
