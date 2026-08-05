import React from 'react';
import { Layers } from 'lucide-react';

export default function CallStack({ callStack = [] }) {
    return (
        <div className="flex flex-col h-full bg-white border border-slate-300 shadow-sm">
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <Layers size={14} className="text-rose-600" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">Call Stack</span>
            </div>
            <div className="flex-1 overflow-auto p-4 flex flex-col justify-end">
                <div className="space-y-2 flex flex-col-reverse">
                    {callStack.length === 0 ? (
                        <div className="text-center text-slate-400 italic text-xs">Stack Empty</div>
                    ) : (
                        callStack.map((frame, i) => (
                            <div key={i} className="bg-rose-50 border border-rose-200 p-2 text-center text-xs font-mono font-bold text-rose-900 shadow-sm animate-in fade-in slide-in-from-top-2 flex justify-between items-center px-4">
                                <span>{frame.name}</span>
                                <span className="text-[10px] text-rose-400 font-normal">{frame.address}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
