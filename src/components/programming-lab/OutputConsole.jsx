import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Copy } from 'lucide-react';

export default function OutputConsole({ logs, clearConsole }) {
    const endRef = useRef(null);

    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const handleCopy = () => {
        const text = logs.map(l => l.msg).join('');
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] border-t md:border-t-0 md:border-l border-slate-800 text-slate-300 w-full">
            <div className="p-3 border-b border-black bg-[#2d2d2d] flex items-center justify-between shrink-0 select-none">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Terminal size={14} /> Console Output
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors p-1" title="Copy Output">
                        <Copy size={12} />
                    </button>
                    <button onClick={clearConsole} className="text-slate-400 hover:text-red-400 transition-colors p-1" title="Clear Console">
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 bg-[#1e1e1e]">
                {logs.length === 0 ? (
                    <span className="text-slate-600 italic">No output yet. Run your code to see the results here.</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className={`whitespace-pre-wrap break-all ${log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-amber-400' : 'text-slate-300'}`}>
                            {log.msg}
                        </div>
                    ))
                )}
                <div ref={endRef} />
            </div>
        </div>
    );
}
