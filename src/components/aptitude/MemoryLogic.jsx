import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ArrowRight, ArrowLeft, Trash2, Plus } from 'lucide-react';

export default function MemoryLogic({ mode = 'stack' }) {
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const push = () => {
        if (!inputValue.trim()) return;
        setItems(prev => [...prev, inputValue.trim()]);
        setInputValue('');
    };

    const pop = () => {
        setItems(prev => prev.slice(0, -1));
    };

    const enqueue = () => {
        if (!inputValue.trim()) return;
        setItems(prev => [...prev, inputValue.trim()]);
        setInputValue('');
    };

    const dequeue = () => {
        setItems(prev => prev.slice(1));
    };

    const isStack = mode === 'stack';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-black font-mono tracking-tighter uppercase text-slate-900">
                    {isStack ? "Stack Visualization (LIFO)" : "Queue Visualization (FIFO)"}
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                    Digital_Aptitude_Subroutine // {isStack ? "LAST_IN_FIRST_OUT" : "FIRST_IN_FIRST_OUT"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white border border-slate-200 p-6 shadow-sm">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Input_Data</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Value..."
                                className="flex-1 border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono focus:border-slate-900 outline-none transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && (isStack ? push() : enqueue())}
                            />
                            <button
                                onClick={isStack ? push : enqueue}
                                className="bg-slate-900 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
                            >
                                <Plus size={14} /> {isStack ? "Push" : "Enqueue"}
                            </button>
                        </div>
                        <button
                            onClick={isStack ? pop : dequeue}
                            disabled={items.length === 0}
                            className="w-full mt-3 border border-slate-900 text-slate-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={14} /> {isStack ? "Pop (LIFO)" : "Dequeue (FIFO)"}
                        </button>
                    </div>

                    <div className="bg-slate-900 text-white p-6 space-y-4">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Simulation_State</h3>
                        <div className="space-y-2 font-mono text-sm">
                            {isStack ? (
                                <div className="flex justify-between items-center py-2 border-b border-white/10">
                                    <span className="text-slate-400">Current TOP:</span>
                                    <span className="text-emerald-400">{items.length > 0 ? items.length - 1 : 'NULL'}</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                                        <span className="text-slate-400">FRONT Index:</span>
                                        <span className="text-emerald-400">{items.length > 0 ? '0' : 'NULL'}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                                        <span className="text-slate-400">REAR Index:</span>
                                        <span className="text-emerald-400">{items.length > 0 ? items.length - 1 : 'NULL'}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-400">Size:</span>
                                <span>{items.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualization Area */}
                <div className="lg:col-span-2 bg-white border border-slate-200 p-8 flex items-center justify-center min-h-[400px]">
                    {isStack ? (
                        <div className="relative flex flex-col-reverse w-48 border-x-4 border-b-4 border-slate-900 p-2 gap-2 min-h-[300px]">
                            {items.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-mono text-xs uppercase tracking-widest">
                                    Stack_Empty
                                </div>
                            )}
                            {items.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className="bg-slate-100 border border-slate-300 p-4 text-center font-mono text-sm font-bold animate-in zoom-in-95 slide-in-from-top-4 duration-300 relative group"
                                >
                                    {item}
                                    {idx === items.length - 1 && (
                                        <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-900 animate-pulse">
                                            <span className="text-[8px] font-black uppercase">Top</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="relative flex w-full border-y-4 border-slate-900 p-4 gap-2 items-center min-h-[120px] overflow-x-auto scrollbar-thin">
                            {items.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-mono text-xs uppercase tracking-widest">
                                    Queue_Empty
                                </div>
                            )}
                            {items.map((item, idx) => (
                                <div 
                                    key={idx}
                                    className="flex-shrink-0 w-24 h-24 bg-slate-100 border border-slate-300 flex items-center justify-center font-mono text-sm font-bold animate-in slide-in-from-right-4 duration-300 relative group"
                                >
                                    {item}
                                    {idx === 0 && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-900">
                                            <span className="text-[8px] font-black uppercase">Front</span>
                                            <ArrowDown size={14} />
                                        </div>
                                    )}
                                    {idx === items.length - 1 && (
                                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-slate-900">
                                            <ArrowUp size={14} />
                                            <span className="text-[8px] font-black uppercase">Rear</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
