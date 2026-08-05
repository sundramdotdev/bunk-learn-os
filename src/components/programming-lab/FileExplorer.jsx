import React from 'react';
import { FileCode2, Plus, Trash2 } from 'lucide-react';

export default function FileExplorer({ files, activeFile, changeFile }) {
    return (
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 w-full md:w-48 lg:w-56 shrink-0">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <FileCode2 size={14} /> Explorer
                </span>
                <button className="text-slate-400 hover:text-white transition-colors" title="New File (Coming Soon)">
                    <Plus size={14} />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2">
                {files.map(f => (
                    <button
                        key={f}
                        onClick={() => changeFile(f)}
                        className={`w-full text-left px-4 py-2 text-xs font-mono transition-colors flex justify-between items-center group ${activeFile === f ? 'bg-slate-800 text-emerald-400 border-l-2 border-emerald-500' : 'hover:bg-slate-800/50 text-slate-400 border-l-2 border-transparent'}`}
                    >
                        <span>{f}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
